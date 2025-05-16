package anistats_api

import v1 "anistats/api/v1"

type MediaRepository interface {
	Get(id v1.MediaId) (*v1.Media, error)
}
