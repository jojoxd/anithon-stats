package widget

import (
	"gioui.org/layout"
	"gioui.org/unit"
	"gioui.org/widget/material"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"git.jojoxd.nl/projects/go-giorno/utils/inset"
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
	return layout.Flex{Axis: layout.Horizontal}.Layout(gtx,
		layout.Rigid(func(gtx layout.Context) layout.Dimensions {
			return s.coverImage.Layout(gtx, th, media.Id)
		}),
		layout.Rigid(func(gtx layout.Context) layout.Dimensions {
			return gkinset.Uniform(unit.Dp(16), func(gtx layout.Context) layout.Dimensions {
				return s.layoutBody(gtx, media)
			})(gtx)
		}),
	)
}

func (s *CardStyle) layoutBody(gtx layout.Context, media v1.Media) layout.Dimensions {
	// localizer := s.app.Localizer()
	return material.Body1(s.app.Theme(), media.Description).Layout(gtx)
}
