package routerlink

import (
	"gioui.org/layout"
	"gioui.org/widget"

	"anistats/pkg/gio_kit/gkrouter2"
	"anistats/pkg/gio_kit/gkrouter2/intent"
)

type Style struct {
	state  *widget.Clickable
	router gkrouter2.Router
}

func New(router gkrouter2.Router) *Style {
	return &Style{
		state:  &widget.Clickable{},
		router: router,
	}
}

type Widget func(gtx layout.Context, button *widget.Clickable) layout.Dimensions

func (s Style) Layout(gtx layout.Context, it intent.Base, widget Widget) layout.Dimensions {
	if s.state.Clicked(gtx) {
		s.router.Push(it)
	}

	return widget(gtx, s.state)
}
