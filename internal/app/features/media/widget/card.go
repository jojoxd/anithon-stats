package widget

import (
	"gioui.org/layout"
	"gioui.org/unit"
	"gioui.org/widget/material"
	"git.jojoxd.nl/projects/go-giorno/ext/glayout"

	"git.jojoxd.nl/projects/go-giorno/utils/inset"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
)

type CardStyle struct {
	app        core.Application
	coverImage *CoverImageStyle
}

func Card(app core.Application) *CardStyle {
	return &CardStyle{
		app:        app,
		coverImage: NewCoverImage(app),
	}
}

func (s *CardStyle) Layout(gtx layout.Context, th *material.Theme, media v1.Media) layout.Dimensions {
	aspect := s.app.LayoutHelper().AspectRatio()

	return glayout.AspectRatioSlots{
		Portrait: func(gtx layout.Context) layout.Dimensions {
			return gkinset.Uniform(unit.Dp(16), func(gtx layout.Context) layout.Dimensions {
				return s.layoutBody(gtx, media)
			})(gtx)
		},
		Landscape: func(gtx layout.Context) layout.Dimensions {
			return layout.Flex{Axis: layout.Horizontal}.Layout(gtx,
				layout.Flexed(1, func(gtx layout.Context) layout.Dimensions {
					return s.coverImage.Layout(gtx, th, media.Id)
				}),
				layout.Flexed(1, func(gtx layout.Context) layout.Dimensions {
					return gkinset.Uniform(unit.Dp(16), func(gtx layout.Context) layout.Dimensions {
						return s.layoutBody(gtx, media)
					})(gtx)
				}),
			)
		},
	}.Layout(gtx, aspect)
}

func (s *CardStyle) layoutBody(gtx layout.Context, media v1.Media) layout.Dimensions {
	localizer := s.app.Localizer()

	return layout.Flex{Axis: layout.Vertical}.Layout(gtx,
		layout.Rigid(material.H4(s.app.Theme(), localizer.Tl(media.DisplayName)).Layout),
		layout.Rigid(material.Body1(s.app.Theme(), media.Description).Layout),
	)
}
