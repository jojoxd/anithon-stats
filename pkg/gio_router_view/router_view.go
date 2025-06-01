package gio_router_view

import (
	"context"

	"gioui.org/layout"

	"anistats/pkg/gio_router"
)

type Slots struct {
	Empty func(ctx context.Context) layout.Dimensions
	View  func(ctx context.Context, view gio_router.RouteView) layout.Dimensions
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

func (rv *RouterView) Layout(ctx context.Context) layout.Dimensions {
	// @todo support animations?
	currentView := rv.mgr.CurrentView()
	if currentView == nil {
		return rv.slots.Empty(ctx)
	}

	return rv.slots.View(ctx, currentView)
}
