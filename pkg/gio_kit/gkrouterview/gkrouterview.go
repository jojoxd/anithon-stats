package gkrouterview

import (
	"gioui.org/layout"

	"anistats/pkg/gio_kit/gkrouter"
)

type Widget func(gtx layout.Context, currentView gkrouter.RouteView) layout.Dimensions

type GkRouterView struct {
	mgr gkrouter.Manager
}

func New(mgr gkrouter.Manager) *GkRouterView {
	return &GkRouterView{
		mgr: mgr,
	}
}

func (w *GkRouterView) Layout(gtx layout.Context, widget Widget) layout.Dimensions {
	return widget(gtx, w.mgr.CurrentView())
}
