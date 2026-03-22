package postgres

import (
	"context"
	"database/sql"

	"github.com/google/uuid"

	"git.jojoxd.nl/projects/anistats/backend/internal/dbal/postgres/internal/generated"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/entity"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/repository"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"
)

type listSettingsRepository struct {
	logger  *aslog.Logger
	queries *generated.Queries
}

func (r listSettingsRepository) Get(ctx context.Context, id string) (*entity.ListSettings, error) {
	pglistSettings, err := r.queries.GetListSettings(ctx, uuid.MustParse(id))
	if err != nil {
		return nil, err
	}

	return r.convert(pglistSettings), nil
}

func (r listSettingsRepository) Create(ctx context.Context) (*entity.ListSettings, error) {
	params := generated.CreateListSettingsParams{
		StackSize:          0,
		AllowChunkMerge:    false,
		MaxChunkLength:     0,
		MaxChunkJoinLength: 0,
	}

	pglistSettings, err := r.queries.CreateListSettings(ctx, params)
	if err != nil {
		return nil, err
	}

	return r.convert(pglistSettings), nil
}

func (r listSettingsRepository) Update(ctx context.Context, id string, dto repository.UpdateListSettingsDto) error {
	params := generated.UpdateListSettingsParams{
		ID:                 uuid.MustParse(id),
		StackSize:          int32(dto.StackSize),
		AllowChunkMerge:    dto.AllowChunkMerge,
		MaxChunkLength:     int32(dto.MaxChunkLength),
		MaxChunkJoinLength: int32(dto.MaxChunkJoinLength),
	}

	return r.queries.UpdateListSettings(ctx, params)
}

func (r listSettingsRepository) Delete(ctx context.Context, id string) error {
	return r.queries.DeleteListSettings(ctx, uuid.MustParse(id))
}

func (r listSettingsRepository) WithTx(tx *sql.Tx) repository.ListSettings {
	return &listSettingsRepository{
		logger:  r.logger,
		queries: r.queries.WithTx(tx),
	}
}

func (r listSettingsRepository) convert(settings generated.ListSetting) *entity.ListSettings {
	return &entity.ListSettings{
		Id:                 settings.ID.String(),
		StackSize:          int(settings.StackSize),
		AllowChunkMerge:    settings.AllowChunkMerge,
		MaxChunkLength:     int(settings.MaxChunkLength),
		MaxChunkJoinLength: int(settings.MaxChunkJoinLength),
	}
}
