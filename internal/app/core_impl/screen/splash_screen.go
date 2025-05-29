package screen

import (
	"gioui.org/layout"
	"gioui.org/text"
	"gioui.org/widget/material"
)

type Splash struct {
	theme *material.Theme
}

func NewSplash(theme *material.Theme) *Splash {
	return &Splash{theme}
}

func (s *Splash) Layout(gtx layout.Context) layout.Dimensions {
	if gtx.Constraints.Max.X < 800 {
		return s.layoutMobile(gtx)
	}

	return s.layoutDesktop(gtx)
}

func (s *Splash) layoutMobile(gtx layout.Context) layout.Dimensions {
	return layout.Flex{Axis: layout.Vertical, Alignment: layout.Middle}.Layout(gtx,
		layout.Rigid(func(gtx layout.Context) layout.Dimensions {
			l := material.Label(s.theme, s.theme.TextSize, "Test")
			l.Color = s.theme.Fg
			l.Alignment = text.Middle

			return l.Layout(gtx)
		}),
		layout.Flexed(1, func(gtx layout.Context) layout.Dimensions {
			l := material.Loader(s.theme)

			return l.Layout(gtx)
		}),
	)
}

func (s *Splash) layoutDesktop(gtx layout.Context) layout.Dimensions {
	body := material.Body1(s.theme, "Desktop Splash")

	return body.Layout(gtx)
}
