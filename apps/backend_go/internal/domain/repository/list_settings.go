package repository

import (
	"context"
	"database/sql"

	"git.jojoxd.nl/projects/anistats/backend/internal/domain/entity"
)

type ListSettings interface {
	Get(ctx context.Context, id string) (*entity.ListSettings, error)
	Create(ctx context.Context) (*entity.ListSettings, error)
	Update(ctx context.Context, id string, dto UpdateListSettingsDto) error
	Delete(ctx context.Context, id string) error

	WithTx(tx *sql.Tx) ListSettings
}

type UpdateListSettingsDto struct {
	StackSize          int
	AllowChunkMerge    bool
	MaxChunkLength     int
	MaxChunkJoinLength int
}
