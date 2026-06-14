package application

import (
	"context"
	"log/slog"

	"git.jojoxd.nl/projects/aslog"
	"github.com/davecgh/go-spew/spew"
	"github.com/google/uuid"

	"git.jojoxd.nl/projects/anistats/backend/ent"
	list2 "git.jojoxd.nl/projects/anistats/backend/ent/list"
	"git.jojoxd.nl/projects/anistats/backend/ent/listentry"
	user2 "git.jojoxd.nl/projects/anistats/backend/ent/user"
	"git.jojoxd.nl/projects/anistats/backend/internal/anilist"
	"git.jojoxd.nl/projects/anistats/backend/internal/anilist/generated"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain"
)

type SyncService struct {
	listService   *domain.ListService
	seriesService *domain.SeriesService
	entryService  *domain.EntryService

	syncSeriesService *domain.SyncSeriesService

	logger *aslog.Logger
}

func NewSyncService(
	listService *domain.ListService,
	seriesService *domain.SeriesService,
	entryService *domain.EntryService,
	syncSeriesService *domain.SyncSeriesService,
	logger *aslog.Logger,
) *SyncService {
	return &SyncService{
		listService:   listService,
		seriesService: seriesService,
		entryService:  entryService,

		syncSeriesService: syncSeriesService,

		logger: logger,
	}
}

func (svc SyncService) SyncUserById(ctx context.Context, tx *ent.Tx, userId uuid.UUID) error {
	user, err := tx.User.Get(ctx, userId)
	if err != nil {
		return err
	}

	svc.logger.Info("sync user", "user.id", user.ID.String(), "user.name", user.Name)

	// fetch user (should be rate-limited)
	al := anilist.NewClient()
	aluser, err := al.GetUser(ctx, user.AnilistID) // todo: drop cast
	if err != nil {
		return err
	}

	svc.logger.Info("sync user",
		slog.Group("user",
			slog.String("id", user.ID.String()),
			slog.String("name", user.Name),
			slog.Any("anilist_id", user.AnilistID),
		),
		slog.Group("aluser",
			slog.Int("id", aluser.Id),
			slog.String("name", aluser.Name),
		),
	)

	user, err = tx.User.UpdateOne(user).
		SetName(aluser.Name).
		SetAvatarURL(getAvatarUrl(aluser.Avatar)).
		Save(ctx)

	if err != nil {
		return err
	}

	return svc.SyncListsByAnilistUserId(ctx, tx, user.AnilistID)
}

func (svc SyncService) SyncListsByAnilistUserId(ctx context.Context, tx *ent.Tx, anilistUserId uint) error {
	client := anilist.NewClient()

	user, err := tx.User.Query().Where(user2.AnilistID(anilistUserId)).Only(ctx)
	if err != nil {
		return err
	}

	userLists, err := client.GetUserLists(ctx, anilistUserId, generated.MediaTypeAnime)
	if err != nil {
		return err
	}

	for _, userList := range userLists.MediaListCollection.Lists {
		// debug: only sync small lists for now
		// if len(userList.Entries) > 25 {
		// 	continue
		// }

		_, err := svc.syncList(ctx, tx, user, userList)
		if err != nil {
			return err
		}
	}

	return nil
}

func (svc SyncService) syncList(
	ctx context.Context,
	tx *ent.Tx,
	user *ent.User,
	allist generated.MediaList,
) (*ent.List, error) {
	svc.logger.Info("Sync list", "user", user, "list.name", allist.Name, "list.#entries", len(allist.Entries))

	list, err := user.QueryLists().Where(list2.NameEQ(allist.Name)).Only(ctx)
	switch {
	case ent.IsNotFound(err):
		q := tx.List.Create()
		svc.listService.AssignMut(q.Mutation(), allist, user.ID)

		list, err = q.Save(ctx)
		if err != nil {
			return nil, err
		}

	case err != nil:
		return nil, err
	}

	spew.Dump(list)

	qlist := list.Update()
	svc.listService.AssignMut(qlist.Mutation(), allist, user.ID)

	var currentEntries []*ent.ListEntry
	// todo: couple/decouple entries
	for _, alentry := range allist.Entries {
		series, err := svc.syncSeriesService.SyncMediaRelatedFragment(ctx, tx, alentry.Media)
		if err != nil {
			return nil, err
		}

		entry, err := list.QueryEntries().Where(listentry.AnilistID(uint(alentry.Id))).Only(ctx)
		switch {
		case ent.IsNotFound(err): // todo: create
			qentry := tx.ListEntry.Create()
			svc.entryService.AssignMut(qentry.Mutation(), series.ID, list.ID, alentry)

			entry, err = qentry.Save(ctx)
			if err != nil {
				return nil, err
			}

			currentEntries = append(currentEntries, entry)
			continue // next entry

		case err != nil:
			return nil, err
		}

		qentry := entry.Update()
		svc.entryService.AssignMut(qentry.Mutation(), series.ID, list.ID, alentry)

		entry, err = qentry.Save(ctx)
		if err != nil {
			return nil, err
		}

		currentEntries = append(currentEntries, entry)

		svc.logger.Info("sync list entry",
			"list_id", list.ID.String(),
			"entry.title", alentry.Media.Title,
			"series.id", series.ID.String(),
		)
	}

	qlist.
		ClearEntries().
		AddEntries(currentEntries...)

	return qlist.Save(ctx)
}

func getAvatarUrl(avatar generated.UserAvatar) string {
	if avatar.Large != "" {
		return avatar.Large
	}

	if avatar.Medium != "" {
		return avatar.Medium
	}

	return ""
}
