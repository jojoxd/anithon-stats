package provider

import (
	"context"
	"image"

	"gioui.org/layout"
	"github.com/google/uuid"

	"anistats/internal/app/core"
	"git.jojoxd.nl/projects/go-giorno/loader"
)

type CoverImage struct {
	loader *loader.Style[uuid.UUID, image.Image]
}

func NewCoverImage(app core.Application) *CoverImage {
	return &CoverImage{
		loader: loader.New(NewCoverImageController(app)),
	}
}

func (p *CoverImage) Layout(gtx layout.Context, id uuid.UUID, slots loader.Widget[image.Image]) layout.Dimensions {
	p.loader.Load(id) // TODO move to Update()

	return p.loader.Layout(gtx, slots)
}

func NewCoverImageController(app core.Application) loader.Controller[uuid.UUID, image.Image] {
	return loader.NewLoaderController(app.GkAsyncScheduler(), &coverImageLoader{
		app: app,
	})
}

type coverImageLoader struct {
	app core.Application
}

func (ldr coverImageLoader) Load(ctx context.Context, mediaId uuid.UUID) (image.Image, error) {
	ldr.app.Logger().Debug("provider.CoverImage: load", "mediaId", mediaId)

	return ldr.app.ApiClient().MediaService().CoverImage(ctx, mediaId)
}
