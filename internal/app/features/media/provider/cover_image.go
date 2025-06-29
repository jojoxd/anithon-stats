package provider

import (
	"context"
	"image"

	"gioui.org/layout"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/pkg/giorno/loader"
)

type CoverImage struct {
	loader *loader.Style[v1.MediaId, image.Image]
}

func NewCoverImage(app core.Application) *CoverImage {
	return &CoverImage{
		loader: loader.New(NewCoverImageController(app)),
	}
}

func (p *CoverImage) Layout(gtx layout.Context, id v1.MediaId, slots loader.Widget[image.Image]) layout.Dimensions {
	p.loader.Load(id) // TODO move to Update()

	return p.loader.Layout(gtx, slots)
}

func NewCoverImageController(app core.Application) loader.Controller[v1.MediaId, image.Image] {
	return loader.NewLoaderController(app.GkAsyncScheduler(), &coverImageLoader{
		app: app,
	})
}

type coverImageLoader struct {
	app core.Application
}

func (ldr coverImageLoader) Load(ctx context.Context, mediaId v1.MediaId) (image.Image, error) {
	ldr.app.Logger().Debug("provider.CoverImage: load", "mediaId", mediaId)

	return ldr.app.ApiClient().MediaService().CoverImage(ctx, mediaId)
}
