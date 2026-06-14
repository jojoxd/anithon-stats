package domain

import (
	"time"

	"git.jojoxd.nl/projects/anistats/backend/ent"
	"git.jojoxd.nl/projects/anistats/backend/internal/anilist/generated"
)

type SeriesService struct{}

func NewSeriesService() *SeriesService {
	return &SeriesService{}
}

func (svc SeriesService) Assign(mut *ent.SeriesMutation, media generated.MediaFragment) {
	mut.SetAnilistID(uint(media.Id))

	mut.SetTitleEnglish(media.Title.English)
	mut.SetTitleRomaji(media.Title.Romaji)
	mut.SetTitleNative(media.Title.Native)

	mut.SetDescription(media.Description)
	mut.SetCoverImageURL(media.CoverImage.ExtraLarge)

	mut.SetEpisodes(uint(media.Episodes))
	mut.SetDuration(time.Duration(media.Duration) * time.Minute)
}
