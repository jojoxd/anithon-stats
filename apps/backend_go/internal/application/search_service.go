package application

import (
	"context"

	"git.jojoxd.nl/projects/aslog"

	"git.jojoxd.nl/projects/anistats/backend/api"
	"git.jojoxd.nl/projects/anistats/backend/ent"
	"git.jojoxd.nl/projects/anistats/backend/internal/anilist"
	"git.jojoxd.nl/projects/anistats/backend/internal/anilist/generated"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain"
)

type SearchService struct {
	db                *ent.Client
	syncSeriesService *domain.SyncSeriesService

	anilist *anilist.Client
	logger  *aslog.Logger
}

func NewSearchService(db *ent.Client, syncSeriesService *domain.SyncSeriesService, anilist *anilist.Client, logger *aslog.Logger) *SearchService {
	return &SearchService{
		db:                db,
		syncSeriesService: syncSeriesService,
		anilist:           anilist,
		logger:            logger,
	}
}

func (svc SearchService) SearchSeries(ctx context.Context, query string) ([]api.Series, error) {
	var series = make([]api.Series, 0)

	err := svc.db.WithTx(ctx, func(tx *ent.Tx) error {
		mediaRelatedFragments, _, err := svc.anilist.SearchSeries(ctx, query, generated.MediaTypeAnime, 1)
		if err != nil {
			return err
		}

		for _, mediaRelatedFragment := range mediaRelatedFragments {
			serieEntity, err := svc.syncSeriesService.SyncMediaRelatedFragment(ctx, tx, mediaRelatedFragment)
			if err != nil {
				return err
			}

			series = append(series, seriesToApi(serieEntity))
		}

		return nil
	})

	return series, err
}
