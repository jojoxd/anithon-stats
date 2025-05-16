package anistats_http

import (
	v1 "anistats/api/v1"
	"anistats/pkg/anistats_api"
)

var _ anistats_api.MediaRepository = &MediaRepository{}

type MediaRepository struct{}

func (m MediaRepository) Get(id v1.MediaId) (*v1.Media, error) {
	// TODO implement me
	panic("implement me")
}
