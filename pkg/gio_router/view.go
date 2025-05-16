package gio_router

import (
	"gioui.org/layout"
)

type View[App any] struct {
	router *Router[App]
}

func NewView[App any](router *Router[App]) *View[App] {
	return &View[App]{router}
}

func (v View[App]) Layout(gtx layout.Context) layout.Dimensions {
	logger := v.router.Logger()

	if idx := len(v.router.stack) - 1; idx >= 0 {
		logger.Debug("gio_router: router view: rendering layout", "layout", v.router.stack[idx])

		return v.router.stack[idx].layout(v.router, gtx)
	}

	logger.Warn("gio_router: router view: no views on stack: maybe push a route target?")
	return layout.Dimensions{}
}
