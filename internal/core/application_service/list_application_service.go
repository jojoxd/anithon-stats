package application_service

import (
	v1 "anistats/api/v1"
	"anistats/pkg/anistats_api"
)

var _ anistats_api.ListApplicationService = &ListApplicationService{}

type ListApplicationService struct{}

func (s ListApplicationService) GetList(id v1.ListId) (*v1.List, error) {
	// TODO implement me
	panic("implement me")
}

func (s ListApplicationService) UpdateList(req v1.UpdateListRequest) (*v1.List, error) {
	// TODO implement me
	panic("implement me")
}
