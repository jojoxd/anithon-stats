package widget

import (
	"image"

	"gioui.org/layout"
	"gioui.org/op/paint"
	"gioui.org/widget"
	"gioui.org/widget/material"
	"github.com/google/uuid"

	"git.jojoxd.nl/projects/go-giorno/loader"

	"anistats/internal/app/core"
	"anistats/internal/app/features/media/provider"
)

type CoverImageStyle struct {
	app      core.Application
	provider *provider.CoverImage
}

func NewCoverImage(app core.Application) *CoverImageStyle {
	return &CoverImageStyle{
		app:      app,
		provider: provider.NewCoverImage(app),
	}
}

func (s *CoverImageStyle) Layout(gtx layout.Context, th *material.Theme, id uuid.UUID) layout.Dimensions {
	return s.provider.Layout(gtx, id, loader.Slots[image.Image]{
		Loading: func(gtx layout.Context) layout.Dimensions {
			// s.app.Logger().Debug("widget/coverimage loading")
			// return material.Body1(th, "coverimage loading...").Layout(gtx)
			return material.Loader(th).Layout(gtx)
		},
		Loaded: func(gtx layout.Context, coverImage image.Image) layout.Dimensions {
			return widget.Image{
				Src: paint.NewImageOp(coverImage),
				Fit: widget.Contain,
			}.Layout(gtx)
		},
	}.Layout)
}
