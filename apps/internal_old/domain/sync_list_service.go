package domain

import (
	"context"
	"database/sql"
	"errors"
	"log/slog"
	"time"

	"git.jojoxd.nl/projects/anistats/backend/internal_old/anilist/generated"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"

	"git.jojoxd.nl/projects/anistats/backend/internal_old/domain/entity"
	"git.jojoxd.nl/projects/anistats/backend/internal_old/domain/repository"
)

type SyncListService struct {
	listRepository         repository.List
	listSettingsRepository repository.ListSettings
	logger                 *aslog.Logger
}

func NewSyncListService(listRepository repository.List, listSettingsRepository repository.ListSettings, logger *aslog.Logger) *SyncListService {
	return &SyncListService{
		listRepository:         listRepository,
		listSettingsRepository: listSettingsRepository,
		logger:                 logger,
	}
}

func (s SyncListService) SyncTx(
	ctx context.Context,
	user *entity.User,
	alList generated.GetUserListsMediaListCollectionListsMediaListGroup,
	tx *sql.Tx,
) (*entity.List, error) {
	list, err := s.listRepository.WithTx(tx).GetUserList(ctx, user.ID.String(), alList.Name)

	if err != nil {
		// did not exist, so create it
		if errors.Is(err, sql.ErrNoRows) {
			s.logger.Debug("user list did not exist, creating a new one",
				slog.Any("user.id", user.ID),
				slog.Any("list.name", alList.Name),
			)

			// listSettings, err := s.listSettingsRepository.WithTx(tx).Create(ctx)
			// if err != nil {
			// 	return nil, err
			// }

			return s.listRepository.WithTx(tx).CreateList(ctx, repository.CreateListDto{
				Name: alList.Name,
				// SettingsId: listSettings.ID,
				UserId: user.ID.String(),
			})
		}

		return nil, err
	}

	s.listRepository.WithTx(tx).UpdateList(ctx, repository.UpdateListDto{
		Id:             list.ID.String(),
		Name:           alList.Name,
		SynchronizedAt: sql.NullTime{Time: time.Now(), Valid: true},
	})

	return list, nil
}
