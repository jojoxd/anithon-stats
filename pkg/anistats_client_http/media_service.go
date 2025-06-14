package anistats_client_http

import (
	"context"
	"image"

	v1 "anistats/api/v1"
	"anistats/pkg/anistats_client"
)

type MediaService struct {
	client *HttpClient
}

func NewMediaService(client *HttpClient) anistats_client.MediaService {
	return &MediaService{
		client: client,
	}
}

func (m MediaService) Media(ctx context.Context, id v1.MediaId) (v1.Media, error) {
	// TODO implement me
	panic("implement me")
}

func (m MediaService) CoverImage(ctx context.Context, id v1.MediaId) (image.Image, error) {
	// TODO implement me
	panic("implement me")
}

func (m MediaService) BannerImage(ctx context.Context, id v1.MediaId) (image.Image, error) {
	// TODO implement me
	panic("implement me")
}
