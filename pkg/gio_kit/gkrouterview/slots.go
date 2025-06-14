package gkrouterview

import (
	"gioui.org/layout"

	"anistats/pkg/gio_kit/gkrouter"
)

type Slots struct {
	Empty func(gtx layout.Context) layout.Dimensions
	View  func(gtx layout.Context, view gkrouter.RouteView) layout.Dimensions
}

func (s Slots) Layout(gtx layout.Context, currentView gkrouter.RouteView) layout.Dimensions {
	if currentView == nil {
		return s.Empty(gtx)
	}

	return s.View(gtx, currentView)
}
