package gio_router

import (
	"context"
	"net/url"

	"gioui.org/layout"
	"github.com/oligo/gioview/theme"
)

type RouteView interface {
	Id() Route
	Layout(ctx context.Context, th *theme.Theme) layout.Dimensions
	OnIntent(intent Intent) error
	Location() url.URL
}

type RouteViewTitler interface {
	Title() string
}

func titleRouteView(rv RouteView) (string, bool) {
	if titler, ok := rv.(RouteViewTitler); ok {
		return titler.Title(), true
	}

	return "", false
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
