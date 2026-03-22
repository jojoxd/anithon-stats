package postgres

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"

	"git.jojoxd.nl/projects/anistats/backend/internal/dbal/postgres/internal/generated"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/entity"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/repository"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"
)

type seriesRepository struct {
	logger  *aslog.Logger
	queries *generated.Queries
}

func (r seriesRepository) Get(ctx context.Context, seriesId string) (*entity.Series, error) {
	pgseries, err := r.queries.GetSeries(ctx, uuid.MustParse(seriesId))
	if err != nil {
		return nil, err
	}

	return r.convert(pgseries), nil
}

func (r seriesRepository) GetAnilist(ctx context.Context, anilistId string) (*entity.Series, error) {
	pgseries, err := r.queries.GetSeriesByAnilistId(ctx, anilistId)
	if err != nil {
		return nil, err
	}

	return r.convert(pgseries), nil
}

func (r seriesRepository) Create(ctx context.Context, dto repository.CreateSeriesDto) (*entity.Series, error) {
	params := generated.CreateSeriesParams{
		AnilistID:          dto.AnilistId,
		TitleTranslationID: uuid.MustParse(dto.TitleTranslationId),
		CoverImageUrl: sql.NullString{
			String: dto.CoverImageUrl,
			Valid:  dto.CoverImageUrl != "",
		},
		Duration:    int32(dto.Duration.Minutes()), // todo better casting
		Episodes:    dto.Episodes,
		Description: dto.Description,
	}

	pgseries, err := r.queries.CreateSeries(ctx, params)
	if err != nil {
		return nil, err
	}

	return r.convert(pgseries), nil
}

func (r seriesRepository) Update(ctx context.Context, seriesId string, dto repository.UpdateSeriesDto) error {
	params := generated.UpdateSeriesParams{
		ID:                 uuid.MustParse(seriesId),
		AnilistID:          dto.AnilistId,
		TitleTranslationID: uuid.MustParse(dto.TitleTranslationId),
		CoverImageUrl:      dto.CoverImage,
		Duration:           int32(dto.Duration.Minutes()), // todo better conversion
		Episodes:           dto.Episodes,
		Description:        dto.Description,
		SynchronizedAt:     dto.SynchronizedAt,
	}

	return r.queries.UpdateSeries(ctx, params)
}

func (r seriesRepository) Delete(ctx context.Context, seriesId string) error {
	return r.queries.DeleteSeries(ctx, uuid.MustParse(seriesId))
}

func (r seriesRepository) convert(pgseries generated.Series) *entity.Series {
	// todo: nil safety

	return &entity.Series{
		Id:                 pgseries.ID.String(),
		TitleTranslationId: pgseries.TitleTranslationID.String(),
		CoverImageUrl:      pgseries.CoverImageUrl.String,
		CreatedAt:          pgseries.CreatedAt,
		SynchronizedAt:     pgseries.SynchronizedAt,
		Episodes:           int64(pgseries.Episodes.Int32),
		Duration:           time.Duration(pgseries.Duration) * time.Minute,
		Description:        pgseries.Description.String,
		PrequelIds:         nil, // todo
		SequelIds:          nil, // todo
	}
}

func (r seriesRepository) WithTx(tx *sql.Tx) repository.Series {
	return &seriesRepository{
		logger:  r.logger,
		queries: r.queries.WithTx(tx),
	}
}
