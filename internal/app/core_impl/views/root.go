package views

import (
	"context"
	"log/slog"

	"gioui.org/app"
	"gioui.org/layout"
	"gioui.org/widget/material"
	"github.com/spf13/viper"

	"anistats/internal/app/core"
	"anistats/internal/app/features"
	"anistats/internal/app/features/home"
	"anistats/pkg/gio_router"
	"anistats/pkg/gio_router_view"
)

type Root struct {
	mgr gio_router.Manager
}

func NewRoot(window *app.Window) *Root {
	mgr := gio_router.NewManager(window, slog.Default())

	features.Register(mgr)

	mgr.RequestSwitch(home.HomeIntent())
	// mgr.RequestSwitch(media.MediaIntent(v1.MediaId("1")))

	// go func() {
	// 	time.Sleep(2 * time.Second)
	//
	// 	mgr.RequestSwitch(media.MediaIntent(v1.MediaId("1")))
	// }()

	return &Root{
		mgr: mgr,
	}
}

func (r Root) Layout(ctx context.Context, gtx layout.Context) layout.Dimensions {
	ctx = r.mgr.Context(ctx, gtx)
	theme := core.ThemeFromContext(ctx)

	r.mgr.Update(ctx)

	// cfg := config.ManagerFromContext(ctx)
	viper.GetViper().Sub("app.client").Debug()
	// slog.Debug("test cfg", "client.type", )

	return layout.Flex{}.Layout(gtx,
		layout.Flexed(1, func(gtx layout.Context) layout.Dimensions {
			return gio_router_view.NewRouterView(r.mgr, &gio_router_view.Slots{
				Empty: func(ctx context.Context) layout.Dimensions {
					return material.H1(theme, "No RouteView").Layout(gtx)
				},
				View: func(ctx context.Context, view gio_router.RouteView) layout.Dimensions {
					return view.Layout(ctx)
				},
			}).Layout(ctx)
		}),
	)
}
