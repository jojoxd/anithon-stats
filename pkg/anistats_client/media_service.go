package anistats_client

import (
	"context"
	"image"

	v1 "anistats/api/v1"
)

type MediaService interface {
	Media(ctx context.Context, mediaId v1.MediaId) (v1.Media, error)
	CoverImage(ctx context.Context, mediaId v1.MediaId) (image.Image, error)
	BannerImage(ctx context.Context, mediaId v1.MediaId) (image.Image, error)
}
