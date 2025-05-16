package anistats_api

import v1 "anistats/api/v1"

type ListApplicationService interface {
	GetList(id v1.ListId) (*v1.List, error)
	UpdateList(req v1.UpdateListRequest) (*v1.List, error)
}
