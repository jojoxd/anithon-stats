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
	"anistats/pkg/gio_router"
)

type MediaCardStyle struct {
	media *v1.Media
}

func MediaCard(media *v1.Media) *MediaCardStyle {
	style := &MediaCardStyle{media: media}

	return style
}

func (s *MediaCardStyle) Layout(ctx context.Context) layout.Dimensions {
	gtx := gio_router.GtxFromContext(ctx)

	return layout.Flex{Axis: layout.Horizontal}.Layout(gtx,
		layout.Flexed(2, func(gtx layout.Context) layout.Dimensions {
			return s.layoutImage(gtx, ctx)
		}),
		layout.Flexed(4,
			inset.Uniform(unit.Dp(16), func(gtx layout.Context) layout.Dimensions {
				return s.layoutBody(gtx, ctx)
			}),
		),
	)
}

func (s *MediaCardStyle) layoutImage(gtx layout.Context, ctx context.Context) layout.Dimensions {
	ms := server_api.NewMediaService()
	i, _ := ms.CoverImage(s.media.Id)
	img := paint.NewImageOp(i)

	return widget.Image{Src: img, Fit: widget.Contain}.Layout(gtx)
}

func (s *MediaCardStyle) layoutBody(gtx layout.Context, ctx context.Context) layout.Dimensions {
	th := core.ThemeFromContext(ctx)
	localizer := core.LocalizerFromContext(ctx)

	return layout.Flex{Axis: layout.Vertical}.Layout(gtx,
		layout.Rigid(material.H3(th, localizer.TTv1(s.media.DisplayName)).Layout),
		layout.Rigid(
			inset.Vertical(unit.Dp(4),
				material.Body1(th, localizer.T("core.media-type.anime")).Layout,
			),
		),
		layout.Rigid(material.Body2(th, s.media.Description).Layout),
	)
}
