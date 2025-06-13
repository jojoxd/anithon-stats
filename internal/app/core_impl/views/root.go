package views

import (
	"gioui.org/layout"
	"gioui.org/widget/material"

	"anistats/internal/app/core"
	"anistats/internal/app/core/route"
	"anistats/internal/app/features"
	"anistats/pkg/gio_router"
	"anistats/pkg/gio_router_view"
)

type Root struct {
	app core.Application
}

func NewRoot(app core.Application) *Root {
	err := features.Register(app, app.Router())
	if err != nil {
		panic(err)
	}

	app.Router().RequestSwitch(route.Home())

	return &Root{
		app: app,
	}
}

func (r Root) Layout(gtx layout.Context) layout.Dimensions {
	router := r.app.Router()
	theme := r.app.Theme()

	router.Update()

	return layout.Flex{}.Layout(gtx,
		layout.Flexed(1, func(gtx layout.Context) layout.Dimensions {
			return gio_router_view.NewRouterView(router, &gio_router_view.Slots{
				Empty: func(gtx layout.Context) layout.Dimensions {
					return material.H1(theme, "No RouteView").Layout(gtx)
				},
				View: func(gtx layout.Context, view gio_router.RouteView) layout.Dimensions {
					return view.Layout(gtx)
				},
			}).Layout(gtx)
		}),
	)
}
