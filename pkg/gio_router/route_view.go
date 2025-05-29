package gio_router

import (
	"net/url"

	"gioui.org/layout"
	"github.com/oligo/gioview/theme"
)

type RouteView interface {
	Id() Route
	Layout(gtx layout.Context, th *theme.Theme) layout.Dimensions
	OnIntent(intent Intent) error
	Location() url.URL
}

type RouteViewTitler interface {
	Title() string
}

type RouteViewFinisher interface {
	OnFinish()
	Finished() bool
}

func finishRouteView(rv RouteView) {
	if finishable, ok := rv.(RouteViewFinisher); ok {
		finishable.OnFinish()
	}
}
