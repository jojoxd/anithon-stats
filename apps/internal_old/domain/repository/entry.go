package repository

import (
	"context"
	"database/sql"

	"git.jojoxd.nl/projects/anistats/backend/api"
	"git.jojoxd.nl/projects/anistats/backend/internal_old/domain/entity"
)

type Entry interface {
	Get(ctx context.Context, id string) (*entity.Entry, error)
	GetByListId(ctx context.Context, listId string) ([]*entity.Entry, error)
	GetByAnilistId(ctx context.Context, anilistId string) (*entity.Entry, error)
	GetByListAndSeriesId(ctx context.Context, listId string, seriesId string) (*entity.Entry, error)
	Create(ctx context.Context, dto CreateEntryDto) (*entity.Entry, error)
	Update(ctx context.Context, id string, dto UpdateEntryDto) error
	Delete(ctx context.Context, id string) error

	WithTx(tx *sql.Tx) Entry
}

type CreateEntryDto struct {
	ListId    string
	SeriesId  string
	DataId    string
	AnilistId string
	State     api.EntryStatus
	Progress  int32
}

type UpdateEntryDto struct {
	SeriesId  string
	AnilistId string
	State     api.EntryStatus
	Progress  int32
}
