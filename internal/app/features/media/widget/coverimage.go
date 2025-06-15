package widget

import (
	"image"

	"gioui.org/layout"
	"gioui.org/op/paint"
	"gioui.org/widget"
	"gioui.org/widget/material"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/internal/app/features/media/provider"
	"anistats/pkg/gio_kit/gkloader"
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

func (s *CoverImageStyle) Layout(gtx layout.Context, th *material.Theme, id v1.MediaId) layout.Dimensions {
	return s.provider.Layout(gtx, id, gkloader.Slots[image.Image]{
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
