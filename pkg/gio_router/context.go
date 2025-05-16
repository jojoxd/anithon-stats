package gio_router

import "gioui.org/layout"

type Context[App any] struct {
	layout.Context
	app App
}

func newContext[App any](gtx layout.Context, app App) Context[App] {
	return Context[App]{
		Context: gtx,
		app:     app,
	}
}

func (c Context[App]) App() App {
	return c.app
}
