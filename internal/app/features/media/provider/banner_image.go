package provider

import (
	"context"
	"image"

	"gioui.org/layout"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/pkg/gio_kit/gkloader"
)

type BannerImage struct {
	loader *gkloader.Style[v1.MediaId, image.Image]
}

func NewBannerImage(app core.Application) *BannerImage {
	return &BannerImage{
		loader: gkloader.New(NewBannerImageController(app)),
	}
}

func (p *BannerImage) Layout(gtx layout.Context, id v1.MediaId, slots gkloader.Widget[image.Image]) layout.Dimensions {
	p.loader.Load(id) // TODO move to Update()

	return p.loader.Layout(gtx, slots)
}

func NewBannerImageController(app core.Application) gkloader.Controller[v1.MediaId, image.Image] {
	return gkloader.NewLoaderController(app.GkAsyncScheduler(), &bannerImageLoader{
		app: app,
	})
}

type bannerImageLoader struct {
	app core.Application
}

func (ldr bannerImageLoader) Load(ctx context.Context, mediaId v1.MediaId) (image.Image, error) {
	ldr.app.Logger().Debug("provider.BannerImage: load", "mediaId", mediaId)
	return ldr.app.ApiClient().MediaService().BannerImage(ctx, mediaId)
}
