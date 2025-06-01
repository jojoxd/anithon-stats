package screens

import (
	"context"

	"gioui.org/layout"

	"anistats/internal/app/core"
	"anistats/pkg/gio_router"
)

var OverviewId = gio_router.NewRoute("media.overview")

type Overview struct {
	location gio_router.RouteLocation
}

func NewOverview() gio_router.RouteView {
	return &Overview{}
}

func (o *Overview) Layout(ctx context.Context) layout.Dimensions {
	// TODO implement me
	panic("implement me")
}

func (o *Overview) OnIntent(intent gio_router.Intent) error {
	o.location = intent.Location()
	return nil
}

func (o *Overview) Id() gio_router.Route {
	// TODO implement me
	panic("implement me")
}

func (o *Overview) Location() gio_router.RouteLocation {
	return o.location
}

func (o *Overview) Title(ctx context.Context) string {
	localizer := core.LocalizerFromContext(ctx)

	return localizer.T("media.overview.title")
}
