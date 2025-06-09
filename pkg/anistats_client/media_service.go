package anistats_client

import (
	"image"

	v1 "anistats/api/v1"
)

type MediaService interface {
	Media(v1.MediaId) (v1.Media, error)
	CoverImage(v1.MediaId) (image.Image, error)
	BannerImage(v1.MediaId) (image.Image, error)
}
