package application

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log/slog"

	"git.jojoxd.nl/projects/anistats/backend/internal/anilist"
	"git.jojoxd.nl/projects/anistats/backend/internal/anilist/generated"
	"git.jojoxd.nl/projects/anistats/backend/internal/application/sync"
	"git.jojoxd.nl/projects/anistats/backend/internal/config"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/dbal"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/entity"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/repository"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"
)

type SyncService struct {
	config                 config.Sync
	database               dbal.Database
	userRepository         repository.User
	listRepository         repository.List
	listSettingsRepository repository.ListSettings
	syncUserService        *domain.SyncUserService
	syncListService        *domain.SyncListService
	syncSeriesService      *domain.SyncSeriesService
	syncEntryService       *domain.SyncEntryService
	logger                 *aslog.Logger
	queue                  chan sync.Job
}

func NewSyncService(
	config config.Sync,
	database dbal.Database,
	userRepository repository.User,
	listRepository repository.List,
	listSettingsRepository repository.ListSettings,
	syncUserService *domain.SyncUserService,
	syncListService *domain.SyncListService,
	syncSeriesService *domain.SyncSeriesService,
	syncEntryService *domain.SyncEntryService,
	logger *aslog.Logger,
) *SyncService {
	return &SyncService{
		config:                 config,
		database:               database,
		userRepository:         userRepository,
		listRepository:         listRepository,
		listSettingsRepository: listSettingsRepository,
		syncUserService:        syncUserService,
		syncListService:        syncListService,
		syncSeriesService:      syncSeriesService,
		syncEntryService:       syncEntryService,
		logger:                 logger,
		queue:                  make(chan sync.Job),
	}
}

func (s SyncService) Start(ctx context.Context) {
	for i := 0; i < int(s.config.Workers); i++ {
		go func() {
			for {
				select {
				case <-ctx.Done():
					return

				case item := <-s.queue:
					err := s.handle(ctx, item)

					if err != nil {
						panic(err)
					}
				}
			}
		}()
	}
}

func (s SyncService) handle(ctx context.Context, item sync.Job) error {

	tx, err := s.database.NewTransaction(ctx)
	if err != nil {
		return err
	}

	switch job := item.(type) {
	case *sync.JobUser:
		err := s.handleUserJob(ctx, job, tx)
		if err != nil {
			if txerr := tx.Rollback(); txerr != nil {
				return errors.Join(err, txerr)
			}
		}

		return err

	case *sync.JobSeries:
		err := s.handleSeriesJob(ctx, job, tx)
		if err != nil {
			if txerr := tx.Rollback(); txerr != nil {
				return errors.Join(err, txerr)
			}
		}

		return err

	default:
		panic(fmt.Errorf("Sync job %#v: unsupported\n", job))
	}
}

func (s SyncService) handleUserJob(ctx context.Context, job *sync.JobUser, tx *sql.Tx) error {
	s.logger.Info("sync user", slog.Any("uid", job.Ref.Id))

	err := s.SyncUserImmediate(ctx, job.Ref.Id, tx)
	if err != nil {
		s.logger.Error(
			"sync user failed",
			slog.Any("err", err),
			slog.Any("uid", job.Ref.Id),
		)
	}

	return err
}

func (s SyncService) handleSeriesJob(ctx context.Context, job *sync.JobSeries, tx *sql.Tx) error {
	s.logger.Info("sync series", slog.Any("sid", job.Ref.Id))

	err := s.SyncSeriesImmediate(ctx, job.Ref.Id, tx)
	if err != nil {
		s.logger.Error(
			"sync series failed",
			slog.Any("err", err),
			slog.Any("sid", job.Ref.Id),
		)
	}

	return err
}

func (s SyncService) Queue(i sync.Job) {
	s.queue <- i
}

func (s SyncService) SyncUserImmediate(ctx context.Context, userId string, tx *sql.Tx) error {

	utx, err := s.database.NewTransaction(ctx)
	if err != nil {
		return err
	}

	user, err := s.syncUserService.SyncImmediateTx(ctx, userId, utx)
	if err != nil {
		utx.Rollback()
		return err
	}

	if err := utx.Commit(); err != nil {
		return err
	}

	// todo
	client := anilist.NewClient(anilist.WithRateLimiter(s.logger))

	// sync lists
	alAnimeUserlists, err := client.GetUserLists(ctx, user.AnilistId, generated.MediaTypeAnime)
	if err != nil {
		return err
	}

	for _, alList := range alAnimeUserlists.MediaListCollection.Lists {
		if err := s.syncList(ctx, user, alList); err != nil {
			return err
		}
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (s SyncService) syncList(ctx context.Context, user *entity.User, alList generated.GetUserListsMediaListCollectionListsMediaListGroup) error {
	ltx, err := s.database.NewTransaction(ctx)
	if err != nil {
		return err
	}

	// // only for debugging
	// if len(alList.Entries) > 40 {
	// 	continue
	// }

	s.logger.Debug("sync user list", "user.name", user.Username, "user.uid", user.AnilistId, "list.name", alList.Name)

	list, err := s.syncListService.SyncTx(ctx, user, alList, ltx)
	if err != nil {
		ltx.Rollback()

		s.logger.Warn("failed to sync list",
			slog.Any("err", err),
			slog.Any("user.name", user.Username),
			slog.Any("list.name", alList.Name))

		return err
	}

	// todo sync entries
	for _, alListEntry := range alList.Entries {
		// Ensure series exists, and is up-to-date
		series, err := s.syncSeriesService.SyncLocalTx(ctx, alListEntry.Media.MediaFragment, ltx)
		if err != nil {
			ltx.Rollback()

			s.logger.Warn("Failed to sync series for entry",
				slog.Any("err", err),
				slog.Any("entry.anilist_id", alListEntry.Id),
				slog.Any("series.anilist_id", alListEntry.Media.MediaFragment.Id))

			return err
		}

		// sync entry

		entry, err := s.syncEntryService.SyncTx(ctx, list, series, alListEntry, ltx)
		if err != nil {
			ltx.Rollback()

			s.logger.Warn("Failed to sync entry",
				slog.Any("err", err),
				slog.Any("entry.anilist_id", alListEntry.Id),
				slog.Any("series.anilist_id", alListEntry.Media.MediaFragment.Id))

			return err
		}

		s.logger.Info("sync entry",
			slog.Any("user.name", user.Username),
			slog.Any("list.name", list.Name),
			slog.Any("series.id", series.Id),
			slog.Any("entry.id", entry.Id))
	}

	s.logger.Info("user list",
		slog.Any("user.name", user.Username),
		slog.Any("list.name", list.Name),
		slog.Any("list.id", list.Id),
		slog.Any("list.total_entries", len(alList.Entries)),
	)

	if err := ltx.Commit(); err != nil {
		s.logger.Warn("failed to commit sync user list",
			slog.Any("err", err),
			slog.Any("user.name", user.Username),
			slog.Any("list.name", list.Name))

		return err
	}

	return nil
}

func (s SyncService) SyncSeriesImmediate(ctx context.Context, seriesId string, tx *sql.Tx) error {

	// todo this converts a seriesId into an anilistId
	series, err := s.syncSeriesService.SyncTx(ctx, seriesId, tx)
	if err != nil {
		return err
	}

	s.logger.Info("sync series", slog.Any("sid", seriesId), slog.Any("series", series))

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}
