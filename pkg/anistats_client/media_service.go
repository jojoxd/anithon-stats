package anistats_client

import (
	"context"
	"image"

	"github.com/google/uuid"

	v1 "anistats/api/v1"
)

type MediaService interface {
	Media(ctx context.Context, mediaId uuid.UUID) (v1.Media, error)
	CoverImage(ctx context.Context, mediaId uuid.UUID) (image.Image, error)
	BannerImage(ctx context.Context, mediaId uuid.UUID) (image.Image, error)
}
