package screens

import (
	"context"

	"gioui.org/layout"

	"anistats/internal/app/widget"
	"anistats/pkg/gio_router"
)

var HomeId = gio_router.NewRoute("home.home")

type Home struct {
	location     gio_router.RouteLocation
	langSwitcher widget.LanguageSwitcher
}

func NewHome() gio_router.RouteView {
	return &Home{
		langSwitcher: widget.NewLanguageSwitcher(),
	}
}

func (h *Home) Layout(ctx context.Context) layout.Dimensions {
	// gtx := gio_router.GtxFromContext(ctx)
	// theme := core.ThemeFromContext(ctx)

	// screen := gkscreen.NewScreen(gkscreen.ScreenSpec{
	// 	Drawer: func(gtx layout.Context) layout.Dimensions {
	// 		return material.H1(theme, "Drawer").Layout(gtx)
	// 	},
	// 	Main: func(gtx layout.Context) layout.Dimensions {
	// 		return material.H1(theme, "Home").Layout(gtx)
	// 	},
	// 	TitleBar: func(gtx layout.Context) layout.Dimensions {
	// 		ml := component.NewModal()
	// 		ab := component.NewAppBar(ml)
	//
	// 		ab.Title = "AppBar Title"
	//
	// 		return ab.Layout(gtx, theme, "nav desc", "overflow desc")
	// 	},
	// })
	//
	// return screen.Layout(gtx)

	// return material.H1(theme, "Home").Layout(gtx)

	return h.langSwitcher.Layout(ctx)
}

func (h *Home) OnIntent(intent gio_router.Intent) error {
	h.location = intent.Location()
	return nil
}

func (h *Home) Id() gio_router.Route {
	return HomeId
}

func (h *Home) Location() gio_router.RouteLocation {
	return h.location
}

func (h *Home) Title(_ context.Context) string {
	return "Home Title"
}

func (h *Home) OnFinish() {}
func (h *Home) Finished() bool {
	return true
}
