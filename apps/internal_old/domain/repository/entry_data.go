package repository

import (
	"context"
	"database/sql"

	"git.jojoxd.nl/projects/anistats/backend/internal_old/domain/entity"
)

type EntryData interface {
	Get(ctx context.Context, id string) (*entity.EntryData, error)
	Create(ctx context.Context, dto CreateEntryDataDto) (*entity.EntryData, error)
	Update(ctx context.Context, id string, dto UpdateEntryDataDto) error
	Delete(ctx context.Context, id string) error

	WithTx(tx *sql.Tx) EntryData
}

type CreateEntryDataDto struct {
	Mult             float64
	Order            sql.NullInt32
	StartAt          sql.NullInt32
	Split            sql.NullInt32
	SplitSequelEntry bool
}

type UpdateEntryDataDto struct {
	Mult             float64
	Order            sql.NullInt32
	StartAt          sql.NullInt32
	Split            sql.NullInt32
	SplitSequelEntry bool
}
