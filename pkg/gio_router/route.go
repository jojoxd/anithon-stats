package gio_router

import "gioui.org/layout"

type Route[P, App any] struct {
	widget Widget[P, App]
}

func (route Route[P, App]) Bind(params P) RouteTarget[App] {
	return RouteTarget[App]{
		layout: func(router *Router[App], gtx layout.Context) layout.Dimensions {
			return route.widget(newContext(gtx, router.app), params)
		},
	}
}

func NewRoute[P, App any](widget Widget[P, App]) *Route[P, App] {
	return &Route[P, App]{widget}
}

type RouteTarget[App any] struct {
	layout func(router *Router[App], gtx layout.Context) layout.Dimensions
}
