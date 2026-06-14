package domain

import (
	"context"
	"time"

	"github.com/hashicorp/golang-lru/v2/expirable"

	"git.jojoxd.nl/projects/anistats/backend/api"
	"git.jojoxd.nl/projects/anistats/backend/internal_old/domain/entity"
	"git.jojoxd.nl/projects/anistats/backend/internal_old/domain/repository"
)

type ListMetadataService struct {
	seriesRepository repository.Series
	statCache        *expirable.LRU[string, *api.ListMetadataStats]
}

func NewListMetadataService(seriesRepository repository.Series) *ListMetadataService {
	statCache := expirable.NewLRU[string, *api.ListMetadataStats](64, nil, time.Second*60)

	return &ListMetadataService{
		seriesRepository: seriesRepository,
		statCache:        statCache,
	}
}

func (s *ListMetadataService) GetMetadata(ctx context.Context, list *entity.List) api.ListMetadata {
	stats, hasStats := s.statCache.Get(list.ID.String())
	if !hasStats {
		var err error
		stats, err = s.queryStats(ctx, list)
		if err != nil {
			panic(err)
		}

		s.statCache.Add(list.ID.String(), stats)
	}

	return api.ListMetadata{
		Title: list.Name,
		// Ref:         list.AsRef(),
		Description: "TODO: Description",

		Stats: *stats,
	}
}

func (s *ListMetadataService) queryStats(ctx context.Context, list *entity.List) (*api.ListMetadataStats, error) {
	stats := &api.ListMetadataStats{Time: 0}

	// for _, entry := range list.Entries {
	// 	series, err := s.seriesRepository.Get(ctx, entry.SeriesID.String())
	// 	if err != nil {
	// 		return nil, err
	// 	}
	//
	// 	entry.Data.Mult = 1
	//
	// 	stats.Time += int64(series.Duration.Minutes()*entry.Data.Mult) * series.Episodes
	// }

	return stats, nil
}
