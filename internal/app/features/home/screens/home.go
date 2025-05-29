package screens

import (
	"context"
	"fmt"
	"net/url"

	"gioui.org/layout"
	"gioui.org/widget/material"

	"anistats/internal/app/core"
	"anistats/pkg/gio_router"
)

var HomeId = gio_router.NewRoute("home.home")

type Home struct{}

func NewHome() gio_router.RouteView {
	return Home{}
}

func (h Home) Layout(ctx context.Context) layout.Dimensions {
	gtx := gio_router.GtxFromContext(ctx)
	theme := core.ThemeFromContext(ctx)

	return material.H1(theme, "Home").Layout(gtx)
}

func (h Home) OnIntent(intent gio_router.Intent) error {
	fmt.Printf("nav to %+v", intent)

	return nil
}

func (h Home) Id() gio_router.Route {
	return HomeId
}

func (h Home) Location() url.URL {
	// TODO implement me
	panic("implement me")
}

func (h Home) Title() string {
	fmt.Printf("Home Title called")
	return "Home Title"
}
