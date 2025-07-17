package anistats_client_http

import (
	"context"
	"encoding/json"
	"fmt"
	"image"
	_ "image/png"
	"io"

	"github.com/google/uuid"

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

func (m MediaService) Media(ctx context.Context, id uuid.UUID) (v1.Media, error) {
	res, err := m.client.client.Get(fmt.Sprintf("http://172.16.0.10:8000/media/%s", id.String()))
	if err != nil {
		return v1.Media{}, err
	}

	defer res.Body.Close()

	bytes, err := io.ReadAll(res.Body)
	if err != nil {
		return v1.Media{}, err
	}

	media := v1.Media{}
	if err := json.Unmarshal(bytes, &media); err != nil {
		return v1.Media{}, err
	}

	return media, nil
}

func (m MediaService) CoverImage(ctx context.Context, id uuid.UUID) (image.Image, error) {
	res, err := m.client.client.Get(fmt.Sprintf("http://172.16.0.10:8000/media/%s/cover-image", id.String()))
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()

	img, _, err := image.Decode(res.Body)
	if err != nil {
		return nil, err
	}

	return img, nil
}

func (m MediaService) BannerImage(ctx context.Context, id uuid.UUID) (image.Image, error) {
	res, err := m.client.client.Get(fmt.Sprintf("http://172.16.0.10:8000/media/%s/banner-image", id.String()))
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()

	img, _, err := image.Decode(res.Body)
	if err != nil {
		return nil, err
	}

	return img, nil
}
