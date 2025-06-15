package provider

import (
	"context"
	"image"

	"gioui.org/layout"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/pkg/gio_kit/gkloader"
)

type CoverImage struct {
	loader *gkloader.Style[v1.MediaId, image.Image]
}

func NewCoverImage(app core.Application) *CoverImage {
	return &CoverImage{
		loader: gkloader.New(NewCoverImageController(app)),
	}
}

func (p *CoverImage) Layout(gtx layout.Context, id v1.MediaId, slots gkloader.Widget[image.Image]) layout.Dimensions {
	p.loader.Load(id) // TODO move to Update()

	return p.loader.Layout(gtx, slots)
}

func NewCoverImageController(app core.Application) gkloader.Controller[v1.MediaId, image.Image] {
	return gkloader.NewLoaderController(app.GkAsyncScheduler(), &coverImageLoader{
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
