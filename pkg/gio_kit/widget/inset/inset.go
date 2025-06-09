package inset

import (
	"gioui.org/layout"
	"gioui.org/unit"
)

func Uniform(v unit.Dp, widget layout.Widget) layout.Widget {
	return func(gtx layout.Context) layout.Dimensions {
		return layout.UniformInset(v).Layout(gtx, widget)
	}
}

func Horizontal(v unit.Dp, widget layout.Widget) layout.Widget {
	return func(gtx layout.Context) layout.Dimensions {
		return layout.Inset{Left: v, Right: v}.Layout(gtx, widget)
	}
}

func Vertical(v unit.Dp, widget layout.Widget) layout.Widget {
	return func(gtx layout.Context) layout.Dimensions {
		return layout.Inset{Top: v, Bottom: v}.Layout(gtx, widget)
	}
}
