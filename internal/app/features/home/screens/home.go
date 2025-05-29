package screens

import (
	"fmt"
	"net/url"

	"gioui.org/layout"
	"gioui.org/widget/material"
	"github.com/oligo/gioview/theme"

	"anistats/pkg/gio_router"
)

var HomeId = gio_router.NewRoute("home.home")

type Home struct{}

func NewHome() gio_router.RouteView {
	return Home{}
}

func (h Home) Layout(gtx layout.Context, th *theme.Theme) layout.Dimensions {
	return material.H1(th.Theme, "Home").Layout(gtx)
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
