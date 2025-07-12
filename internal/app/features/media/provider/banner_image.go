package provider

import (
	"context"
	"image"

	"gioui.org/layout"
	"github.com/google/uuid"

	"git.jojoxd.nl/projects/go-giorno/loader"

	"anistats/internal/app/core"
)

type BannerImage struct {
	loader *loader.Style[uuid.UUID, image.Image]
}

func NewBannerImage(app core.Application) *BannerImage {
	return &BannerImage{
		loader: loader.New(NewBannerImageController(app)),
	}
}

func (p *BannerImage) Layout(gtx layout.Context, id uuid.UUID, slots loader.Widget[image.Image]) layout.Dimensions {
	p.loader.Load(id) // TODO move to Update()

	return p.loader.Layout(gtx, slots)
}

func NewBannerImageController(app core.Application) loader.Controller[uuid.UUID, image.Image] {
	return loader.NewLoaderController(app.GkAsyncScheduler(), &bannerImageLoader{
		app: app,
	})
}

type bannerImageLoader struct {
	app core.Application
}

func (ldr bannerImageLoader) Load(ctx context.Context, mediaId uuid.UUID) (image.Image, error) {
	ldr.app.Logger().Debug("provider.BannerImage: load", "mediaId", mediaId)
	return ldr.app.ApiClient().MediaService().BannerImage(ctx, mediaId)
}
