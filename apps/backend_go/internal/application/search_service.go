package application

import (
	"context"
	"fmt"

	"git.jojoxd.nl/projects/anistats/backend/api"
	"git.jojoxd.nl/projects/anistats/backend/internal/dev"
)

type SearchService struct{}

func NewSearchService() *SearchService {
	return &SearchService{}
}

func (s SearchService) SearchSeries(ctx context.Context, query string) (*api.SeriesList, error) {
	res := &api.SeriesList{
		Items: []api.Series{
			dev.Series_MedalistSeason2,
		},
	}

	return res, nil
}

func (s SearchService) SearchGlobal(ctx context.Context, query string) (*api.SearchList, error) {
	return nil, fmt.Errorf("Not yet implemented")
}
