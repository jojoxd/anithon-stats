package domain

import (
	"git.jojoxd.nl/projects/anistats/backend/api"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/entity"
)

type ListMetadataService struct{}

func NewListMetadataService() *ListMetadataService {
	return &ListMetadataService{}
}

func (s ListMetadataService) CreateMetadata(list entity.List) api.ListMetadata {
	return api.ListMetadata{
		Title:       list.Name,
		Ref:         list.AsRef(),
		Description: "TODO: Description",

		Stats: api.ListMetadataStats{
			Time: 123456,
		},
	}
}
