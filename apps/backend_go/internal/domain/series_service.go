package domain

import (
	"context"
	"database/sql"
	"strconv"
	"time"

	"git.jojoxd.nl/projects/anistats/backend/internal/anilist/generated"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/entity"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/repository"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"
)

type SeriesService struct {
	seriesRepository   repository.Series
	translationService *TranslationService
	logger             *aslog.Logger
}

func NewSeriesService(
	seriesRepository repository.Series,
	translationService *TranslationService,
	logger *aslog.Logger,
) *SeriesService {
	return &SeriesService{
		seriesRepository:   seriesRepository,
		translationService: translationService,
		logger:             logger,
	}
}

func (s SeriesService) CreateFromAnilistTx(
	ctx context.Context,
	alseries generated.MediaFragment,
	tx *sql.Tx,
) (*entity.Series, error) {
	titleTranslation, err := s.translationService.CreateMediaTranslationTx(ctx, alseries.Title, tx)
	if err != nil {
		return nil, err
	}

	return s.seriesRepository.WithTx(tx).Create(ctx, repository.CreateSeriesDto{
		AnilistId:          strconv.Itoa(alseries.Id),
		TitleTranslationId: titleTranslation.Id,
		CoverImageUrl:      "",
		Duration:           0,
		Episodes:           sql.NullInt32{},
		Description:        sql.NullString{},
	})
}

func (s SeriesService) UpdateFromAnilistTx(
	ctx context.Context,
	series *entity.Series,
	alseries generated.MediaFragment,
	tx *sql.Tx,
) (*entity.Series, error) {
	dto := repository.UpdateSeriesDto{
		AnilistId:          strconv.Itoa(alseries.Id),
		TitleTranslationId: series.TitleTranslationId,
		CoverImage: sql.NullString{
			String: alseries.CoverImage.ExtraLarge,
			Valid:  alseries.CoverImage.ExtraLarge != "",
		},
		Duration: time.Duration(alseries.Duration) * time.Minute,
		Episodes: sql.NullInt32{
			Int32: int32(alseries.Episodes),
			Valid: alseries.Episodes != 0,
		},
		Description: sql.NullString{
			String: alseries.Description,
			Valid:  alseries.Description != "",
		},
		SynchronizedAt: sql.NullTime{
			Time:  time.Now(),
			Valid: true,
		},
	}

	err := s.seriesRepository.WithTx(tx).Update(ctx, series.Id, dto)
	if err != nil {
		return nil, err
	}

	return s.seriesRepository.WithTx(tx).Get(ctx, series.Id)
}
