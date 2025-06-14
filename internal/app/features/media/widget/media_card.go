package widget

import (
	"context"

	"gioui.org/layout"
	"gioui.org/op/paint"
	"gioui.org/unit"
	"gioui.org/widget"
	"gioui.org/widget/material"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/internal/server/server_api"
	"anistats/pkg/gio_kit/widget/inset"
)

type MediaCardStyle struct {
	app core.Application
}

func MediaCard(app core.Application) *MediaCardStyle {
	style := &MediaCardStyle{
		app: app,
	}

	return style
}

func (s *MediaCardStyle) Layout(gtx layout.Context, media *v1.Media) layout.Dimensions {
	return layout.Flex{Axis: layout.Horizontal}.Layout(gtx,
		layout.Flexed(2, func(gtx layout.Context) layout.Dimensions {
			return s.layoutImage(gtx, media)
		}),
		layout.Flexed(4,
			inset.Uniform(unit.Dp(16), func(gtx layout.Context) layout.Dimensions {
				return s.layoutBody(gtx, media)
			}),
		),
	)
}

func (s *MediaCardStyle) layoutImage(gtx layout.Context, media *v1.Media) layout.Dimensions {
	ms := server_api.NewMediaService()
	i, _ := ms.CoverImage(context.TODO(), media.Id)
	img := paint.NewImageOp(i)

	return widget.Image{Src: img, Fit: widget.Contain}.Layout(gtx)
}

func (s *MediaCardStyle) layoutBody(gtx layout.Context, media *v1.Media) layout.Dimensions {
	theme := s.app.Theme()
	localizer := s.app.Localizer()

	return layout.Flex{Axis: layout.Vertical}.Layout(gtx,
		layout.Rigid(material.H3(theme, localizer.TTv1(media.DisplayName)).Layout),
		layout.Rigid(
			inset.Vertical(unit.Dp(4),
				material.Body1(theme, localizer.T("core.media-type.anime")).Layout,
			),
		),
		layout.Rigid(material.Body2(theme, media.Description).Layout),
	)
}
