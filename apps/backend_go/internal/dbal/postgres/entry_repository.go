package postgres

import (
	"context"
	"database/sql"

	"github.com/google/uuid"

	"git.jojoxd.nl/projects/anistats/backend/api"
	"git.jojoxd.nl/projects/anistats/backend/internal/dbal/postgres/internal/generated"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/entity"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/repository"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"
)

type entryRepository struct {
	logger  *aslog.Logger
	queries *generated.Queries
}

func (r entryRepository) Get(ctx context.Context, id string) (*entity.Entry, error) {
	pgentry, err := r.queries.GetEntry(ctx, uuid.MustParse(id))
	if err != nil {
		return nil, err
	}

	return r.convertEntry(pgentry), nil
}

func (r entryRepository) GetByListId(ctx context.Context, listId string) ([]*entity.Entry, error) {
	pgentries, err := r.queries.GetListEntries(ctx, uuid.MustParse(listId))
	if err != nil {
		return nil, err
	}

	entries := make([]*entity.Entry, len(pgentries))
	for i, entry := range pgentries {
		entries[i] = r.convertEntry(entry)
	}

	return entries, nil
}

func (r entryRepository) GetByListAndSeriesId(ctx context.Context, listId string, seriesId string) (*entity.Entry, error) {
	params := generated.GetEntryByListAndSeriesIdParams{
		ListID:   uuid.MustParse(listId),
		SeriesID: uuid.MustParse(seriesId),
	}
	pgentry, err := r.queries.GetEntryByListAndSeriesId(ctx, params)
	if err != nil {
		return nil, err
	}

	return r.convertEntry(pgentry), nil
}

func (r entryRepository) GetByAnilistId(ctx context.Context, anilistId string) (*entity.Entry, error) {
	panic("don't use me")

	pgentry, err := r.queries.GetEntryByAnilistId(ctx, anilistId)
	if err != nil {
		return nil, err
	}

	return r.convertEntry(pgentry), nil
}

func (r entryRepository) Create(ctx context.Context, dto repository.CreateEntryDto) (*entity.Entry, error) {
	params := generated.CreateEntryParams{
		ListID:   uuid.MustParse(dto.ListId),
		SeriesID: uuid.MustParse(dto.SeriesId),
		DataID:   uuid.MustParse(dto.DataId),
		CustomSequelEntryID: uuid.NullUUID{
			UUID:  uuid.Nil,
			Valid: false,
		},
		AnilistID: dto.AnilistId,
		State:     dto.State.String(),
		Progress:  dto.Progress,
	}

	pgentry, err := r.queries.CreateEntry(ctx, params)
	if err != nil {
		return nil, err
	}

	return r.convertEntry(pgentry), nil
}

func (r entryRepository) Update(ctx context.Context, id string, dto repository.UpdateEntryDto) error {
	params := generated.UpdateEntryParams{
		ID:       uuid.MustParse(id),
		SeriesID: uuid.MustParse(dto.SeriesId),
		CustomSequelEntryID: uuid.NullUUID{
			UUID:  uuid.Nil,
			Valid: false,
		},
		AnilistID: dto.AnilistId,
		State:     dto.State.String(),
		Progress:  dto.Progress,
	}

	return r.queries.UpdateEntry(ctx, params)
}

func (r entryRepository) Delete(ctx context.Context, id string) error {
	return r.queries.DeleteEntry(ctx, uuid.MustParse(id))
}

func (r entryRepository) convertEntry(pgentry generated.Entry) *entity.Entry {
	return &entity.Entry{
		Id:        pgentry.ID.String(),
		AnilistId: pgentry.AnilistID,
		ListId:    pgentry.ListID.String(),
		SeriesId:  pgentry.SeriesID.String(),
		// Data:   pgentry.DataID,
		State:    api.EntryStatus(pgentry.State),
		Progress: int64(pgentry.Progress),
		CustomSequelSeriesId: sql.NullString{
			String: pgentry.CustomSequelEntryID.UUID.String(),
			Valid:  pgentry.CustomSequelEntryID.Valid,
		},
	}
}

func (r entryRepository) WithTx(tx *sql.Tx) repository.Entry {
	return entryRepository{
		logger:  r.logger,
		queries: r.queries.WithTx(tx),
	}
}
