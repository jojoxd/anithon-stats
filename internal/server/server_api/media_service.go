package server_api

import (
	"context"
	"image"
	"net/http"
	"time"

	"golang.org/x/text/language"

	v1 "anistats/api/v1"
	"anistats/pkg/anistats_client"
)

var _ anistats_client.MediaService = (*MediaService)(nil)

type MediaService struct{}

func NewMediaService() anistats_client.MediaService {
	return &MediaService{}
}

func (m MediaService) Media(ctx context.Context, id v1.MediaId) (v1.Media, error) {
	time.Sleep(5 * time.Second)

	return v1.Media{
		Id: id,
		DisplayName: v1.Translatable{
			Translations: map[language.Tag]string{
				language.English: "server-1",
			},
		},
		Description: "server-1",
		Episodes: v1.MediaEpisodes{
			Total:    12,
			Duration: time.Duration(24) * time.Minute,
		},
		Related: v1.MediaRelations{
			PrequelIds: []v1.MediaId{},
			SequelIds:  []v1.MediaId{},
		},
	}, nil
}

func (m MediaService) CoverImage(ctx context.Context, id v1.MediaId) (image.Image, error) {
	res, err := http.Get("https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114-nSWCgQlmOMtj.jpg")
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()

	img, _, err := image.Decode(res.Body)
	return img, err
}

func (m MediaService) BannerImage(ctx context.Context, id v1.MediaId) (image.Image, error) {
	// TODO implement me
	panic("implement me")
}
