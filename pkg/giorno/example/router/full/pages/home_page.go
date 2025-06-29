package pages

import (
	"fmt"

	"gioui.org/layout"
	"gioui.org/widget"
	"gioui.org/widget/material"

	"anistats/pkg/giorno/example/router/full/routes"
	"anistats/pkg/giorno/router2"
	"anistats/pkg/giorno/router2/intent"
	"anistats/pkg/giorno/router2/routerlink"
)

type HomePage struct {
	routerLink *routerlink.Style
	Theme      *material.Theme
}

func NewHomePage(th *material.Theme, router router2.Router) *HomePage {
	return &HomePage{
		routerLink: routerlink.New(router),
		Theme:      th,
	}
}

func (h HomePage) Layout(gtx layout.Context) layout.Dimensions {
	fmt.Printf("HomePage$Layout\n")

	return h.routerLink.Layout(gtx, routes.SubPage.Intent(), func(gtx layout.Context, button *widget.Clickable) layout.Dimensions {
		return material.Button(h.Theme, button, "SubPage").Layout(gtx)
	})
}

func (h HomePage) OnIntent(intent intent.Base) {
	fmt.Printf("HomePage$OnIntent: %#v\n", intent)
}
