package provider

import (
	"context"

	"gioui.org/layout"
	"github.com/google/uuid"

	"git.jojoxd.nl/projects/go-giorno/loader"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
)

type Media struct {
	loader *loader.Style[uuid.UUID, v1.Media]
}

func NewMedia(app core.Application) *Media {
	return &Media{
		loader: loader.New(NewMediaController(app)),
	}
}

func (p *Media) Layout(gtx layout.Context, id uuid.UUID, slots loader.Widget[v1.Media]) layout.Dimensions {
	p.loader.Load(id) // TODO move to Update()

	return p.loader.Layout(gtx, slots)
}

func NewMediaController(app core.Application) loader.Controller[uuid.UUID, v1.Media] {
	return loader.NewLoaderController(app.GkAsyncScheduler(), &mediaLoader{
		app: app,
	})
}

type mediaLoader struct {
	app core.Application
}

func (ldr mediaLoader) Load(ctx context.Context, mediaId uuid.UUID) (v1.Media, error) {
	ldr.app.Logger().Debug("provider.Media: load", "mediaId", mediaId)
	return ldr.app.ApiClient().MediaService().Media(ctx, mediaId)
}
