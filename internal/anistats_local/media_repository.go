package anistats_local

import (
	v1 "anistats/api/v1"
	"anistats/pkg/anistats_api"
)

var _ anistats_api.MediaRepository = &MediaRepository{}

type MediaRepository struct{}

func New() anistats_api.MediaRepository {
	return &MediaRepository{}
}

func (m MediaRepository) Get(id v1.MediaId) (*v1.Media, error) {
	return nil, nil
}
