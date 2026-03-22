package repository

import (
	"context"
	"database/sql"
	"time"

	"git.jojoxd.nl/projects/anistats/backend/internal/domain/entity"
)

type Series interface {
	Get(ctx context.Context, seriesId string) (*entity.Series, error)
	GetAnilist(ctx context.Context, anilistId string) (*entity.Series, error)
	Create(ctx context.Context, dto CreateSeriesDto) (*entity.Series, error)
	Update(ctx context.Context, seriesId string, dto UpdateSeriesDto) error
	Delete(ctx context.Context, seriesId string) error

	WithTx(tx *sql.Tx) Series
}

type CreateSeriesDto struct {
	AnilistId          string
	TitleTranslationId string
	CoverImageUrl      string
	Duration           time.Duration
	Episodes           sql.NullInt32
	Description        sql.NullString
}

type UpdateSeriesDto struct {
	AnilistId          string
	TitleTranslationId string
	CoverImage         sql.NullString
	Duration           time.Duration
	Episodes           sql.NullInt32
	Description        sql.NullString
	SynchronizedAt     sql.NullTime
}
