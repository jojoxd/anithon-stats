package domain

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strconv"

	"git.jojoxd.nl/projects/anistats/backend/internal_old/anilist"
	"git.jojoxd.nl/projects/anistats/backend/internal_old/anilist/generated"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"

	"git.jojoxd.nl/projects/anistats/backend/internal_old/domain/entity"
	"git.jojoxd.nl/projects/anistats/backend/internal_old/domain/repository"
)

type SyncSeriesService struct {
	seriesRepository   repository.Series
	translationService *TranslationService
	seriesService      *SeriesService
	logger             *aslog.Logger
}

func NewSyncSeriesService(
	seriesRepository repository.Series,
	seriesService *SeriesService,
	translationService *TranslationService,
	logger *aslog.Logger,
) *SyncSeriesService {
	return &SyncSeriesService{
		seriesRepository:   seriesRepository,
		translationService: translationService,
		seriesService:      seriesService,
		logger:             logger,
	}
}

func (s SyncSeriesService) SyncTx(ctx context.Context, anilistId string, tx *sql.Tx) (*entity.Series, error) {
	client := anilist.NewClient(anilist.WithRateLimiter(s.logger))

	mediaFragment, err := client.GetSeries(ctx, anilistId)
	if err != nil {
		return nil, err
	}

	return s.SyncLocalTx(ctx, mediaFragment, tx)
}

func (s SyncSeriesService) SyncLocalTx(ctx context.Context, mediaFragment generated.MediaFragment, tx *sql.Tx) (*entity.Series, error) {
	series, err := s.getOrCreateAnilistSeriesTx(ctx, mediaFragment, tx)
	if err != nil {
		return nil, fmt.Errorf("failed get or create series %d: %w", mediaFragment.Id, err)
	}

	_, err = s.translationService.UpdateMediaTranslationTx(ctx, strconv.FormatUint(uint64(series.TitleTranslationID), 10), mediaFragment.Title, tx)
	if err != nil {
		return nil, fmt.Errorf("failed to update translation %s: %w", series.TitleTranslationID, err)
	}

	seriesId := series.ID.String()
	series, err = s.seriesService.UpdateFromAnilistTx(ctx, series, mediaFragment, tx)
	if err != nil {
		return nil, fmt.Errorf("failed to update series (id=%s): %w", seriesId, err)
	}

	return s.seriesRepository.WithTx(tx).Get(ctx, series.ID.String())
}

func (s SyncSeriesService) getOrCreateAnilistSeriesTx(ctx context.Context, mediaFragment generated.MediaFragment, tx *sql.Tx) (*entity.Series, error) {
	series, err := s.seriesRepository.WithTx(tx).GetAnilist(ctx, strconv.Itoa(mediaFragment.Id))
	if err == nil {
		return series, err
	}

	if errors.Is(err, sql.ErrNoRows) {
		return s.seriesService.CreateFromAnilistTx(ctx, mediaFragment, tx)
	}

	return nil, err
}
