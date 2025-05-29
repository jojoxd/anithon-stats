package screens

import (
	"context"
	"net/url"

	"gioui.org/layout"
	"github.com/oligo/gioview/theme"

	"anistats/pkg/gio_router"
)

var OverviewId = gio_router.NewRoute("media.overview")

type Overview struct{}

func NewOverview() gio_router.RouteView {
	return Overview{}
}

func (o Overview) Layout(ctx context.Context, th *theme.Theme) layout.Dimensions {
	// TODO implement me
	panic("implement me")
}

func (o Overview) OnIntent(intent gio_router.Intent) error {
	// TODO implement me
	panic("implement me")
}

func (o Overview) Id() gio_router.Route {
	// TODO implement me
	panic("implement me")
}

func (o Overview) Location() url.URL {
	// TODO implement me
	panic("implement me")
}

func (o Overview) Title() string {
	// TODO implement me
	panic("implement me")
}
