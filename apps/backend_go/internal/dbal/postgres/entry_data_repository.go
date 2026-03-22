package postgres

import (
	"context"
	"database/sql"
	"strconv"

	"github.com/google/uuid"

	"git.jojoxd.nl/projects/anistats/backend/internal/dbal/postgres/internal/generated"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/entity"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/repository"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"
)

type entryDataRepository struct {
	logger  *aslog.Logger
	queries *generated.Queries
}

func (r entryDataRepository) Get(ctx context.Context, id string) (*entity.EntryData, error) {
	pgdata, err := r.queries.GetEntryData(ctx, uuid.MustParse(id))
	if err != nil {
		return nil, err
	}

	return r.convert(pgdata), nil
}

func (r entryDataRepository) Create(ctx context.Context, dto repository.CreateEntryDataDto) (*entity.EntryData, error) {
	params := generated.CreateEntryDataParams{
		Mult:             strconv.FormatFloat(dto.Mult, 'f', -1, 64),
		Order:            dto.Order,
		StartAt:          dto.StartAt,
		Split:            dto.Split,
		SplitSequelEntry: dto.SplitSequelEntry,
	}

	pgdata, err := r.queries.CreateEntryData(ctx, params)
	if err != nil {
		return nil, err
	}

	return r.convert(pgdata), nil
}

func (r entryDataRepository) Update(ctx context.Context, id string, dto repository.UpdateEntryDataDto) error {
	params := generated.UpdateEntryDataParams{
		ID:               uuid.MustParse(id),
		Mult:             strconv.FormatFloat(dto.Mult, 'f', -1, 64),
		Order:            dto.Order,
		StartAt:          dto.StartAt,
		Split:            dto.Split,
		SplitSequelEntry: dto.SplitSequelEntry,
	}

	return r.queries.UpdateEntryData(ctx, params)
}

func (r entryDataRepository) Delete(ctx context.Context, id string) error {
	return r.queries.DeleteEntryData(ctx, uuid.MustParse(id))
}

func (r entryDataRepository) convert(pgdata generated.EntryDatum) *entity.EntryData {
	multf64, _ := strconv.ParseFloat(pgdata.Mult, 64)

	return &entity.EntryData{
		Id:               pgdata.ID.String(),
		Mult:             multf64,
		Order:            pgdata.Order,
		StartAt:          pgdata.StartAt,
		Split:            pgdata.Split,
		SplitSequelEntry: pgdata.SplitSequelEntry,
	}
}

func (r entryDataRepository) WithTx(tx *sql.Tx) repository.EntryData {
	return &entryDataRepository{
		logger:  r.logger,
		queries: r.queries.WithTx(tx),
	}
}
