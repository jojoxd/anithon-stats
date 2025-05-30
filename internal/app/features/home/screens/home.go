package screens

import (
	"context"

	"gioui.org/layout"
	"gioui.org/widget/material"

	"anistats/internal/app/core"
	"anistats/pkg/gio_router"
)

var HomeId = gio_router.NewRoute("home.home")

type Home struct {
	location gio_router.RouteLocation
}

func NewHome() gio_router.RouteView {
	return &Home{}
}

func (h *Home) Layout(ctx context.Context) layout.Dimensions {
	gtx := gio_router.GtxFromContext(ctx)
	theme := core.ThemeFromContext(ctx)

	return material.H1(theme, "Home").Layout(gtx)
}

func (h *Home) OnIntent(intent gio_router.Intent) error {
	h.location = intent.Location()
	return nil
}

func (h *Home) Id() gio_router.Route {
	return HomeId
}

func (h *Home) Location() gio_router.RouteLocation {
	return h.location
}

func (h *Home) Title() string {
	return "Home Title"
}

func (h *Home) OnFinish() {}
func (h *Home) Finished() bool {
	return true
}
