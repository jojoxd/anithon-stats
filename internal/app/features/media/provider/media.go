package provider

import (
	"context"

	"gioui.org/layout"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/pkg/giorno/loader"
)

type Media struct {
	loader *loader.Style[v1.MediaId, v1.Media]
}

func NewMedia(app core.Application) *Media {
	return &Media{
		loader: loader.New(NewMediaController(app)),
	}
}

func (p *Media) Layout(gtx layout.Context, id v1.MediaId, slots loader.Widget[v1.Media]) layout.Dimensions {
	p.loader.Load(id) // TODO move to Update()

	return p.loader.Layout(gtx, slots)
}

func NewMediaController(app core.Application) loader.Controller[v1.MediaId, v1.Media] {
	return loader.NewLoaderController(app.GkAsyncScheduler(), &mediaLoader{
		app: app,
	})
}

type mediaLoader struct {
	app core.Application
}

func (ldr mediaLoader) Load(ctx context.Context, mediaId v1.MediaId) (v1.Media, error) {
	ldr.app.Logger().Debug("provider.Media: load", "mediaId", mediaId)
	return ldr.app.ApiClient().MediaService().Media(ctx, mediaId)
}
