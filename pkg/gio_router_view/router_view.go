package gio_router_view

import (
	"gioui.org/layout"

	"anistats/pkg/gio_router"
)

type Slots struct {
	Empty func(gtx layout.Context) layout.Dimensions
	View  func(gtx layout.Context, view gio_router.RouteView) layout.Dimensions
}

type RouterView struct {
	mgr   gio_router.Manager
	slots *Slots
}

func NewRouterView(mgr gio_router.Manager, slots *Slots) *RouterView {
	return &RouterView{
		mgr:   mgr,
		slots: slots,
	}
}

func (rv *RouterView) Layout(gtx layout.Context) layout.Dimensions {
	// @todo support animations?
	currentView := rv.mgr.CurrentView()
	if currentView == nil {
		return rv.slots.Empty(gtx)
	}

	return rv.slots.View(gtx, currentView)
}
