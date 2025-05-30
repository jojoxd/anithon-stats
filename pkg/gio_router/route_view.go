package gio_router

import (
	"context"
	"fmt"

	"gioui.org/layout"

	"anistats/pkg/gio_router/external"
)

type RouteView interface {
	Id() Route
	Layout(ctx context.Context) layout.Dimensions
	OnIntent(intent Intent) error
	Location() RouteLocation
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

func finishRouteView(rv RouteView, logger external.Logger) {
	if finishable, ok := rv.(RouteViewFinisher); ok {
		logger.Debug(fmt.Sprintf("finishing view %T", rv))
		finishable.OnFinish()
		logger.Debug(fmt.Sprintf("finished view %T", rv))
	}
}
