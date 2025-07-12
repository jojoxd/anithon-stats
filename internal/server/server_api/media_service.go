package server_api

import (
	"context"
	"image"
	"net/http"

	"github.com/google/uuid"

	v1 "anistats/api/v1"
	"anistats/internal/server/dbal"
	"anistats/internal/server/marshaller"
	"anistats/pkg/anistats_client"
	cachepkg "anistats/pkg/cache"
)

var _ anistats_client.MediaService = (*MediaService)(nil)

type MediaService struct {
	repo  dbal.MediaRepository
	cache cachepkg.Cache
}

func NewMediaService(repo dbal.MediaRepository, cache cachepkg.Cache) anistats_client.MediaService {
	return &MediaService{
		repo:  repo,
		cache: cachepkg.NewPrefix("media", cache),
	}
}

func (m *MediaService) Media(ctx context.Context, id uuid.UUID) (v1.Media, error) {
	return m.repo.GetMedia(ctx, id)
}

func (m *MediaService) CoverImage(ctx context.Context, id uuid.UUID) (image.Image, error) {
	c := cachepkg.NewMarshal(marshaller.Image{}, cachepkg.NewPrefix("cover", m.cache))
	return c.GetFunc(id.String(), func(key string) (image.Image, error) {
		res, err := http.Get("https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114-nSWCgQlmOMtj.jpg")
		if err != nil {
			return nil, err
		}

		defer res.Body.Close()

		img, _, err := image.Decode(res.Body)
		return img, err
	})
}

func (m *MediaService) BannerImage(ctx context.Context, id uuid.UUID) (image.Image, error) {
	c := cachepkg.NewMarshal(marshaller.Image{}, cachepkg.NewPrefix("banner", m.cache))

	return c.GetFunc(id.String(), func(key string) (image.Image, error) {
		res, err := http.Get("https://s4.anilist.co/file/anilistcdn/media/anime/banner/5114-q0V5URebphSG.jpg")
		if err != nil {
			return nil, err
		}

		defer res.Body.Close()

		img, _, err := image.Decode(res.Body)
		return img, err
	})
}
