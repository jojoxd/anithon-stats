package screens

import (
	"context"
	"time"

	"gioui.org/layout"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/internal/app/core/route"
	"anistats/internal/app/widget"
	"anistats/pkg/gio_router"
)

type Home struct {
	gio_router.BaseScreen
	app          core.Application
	langSwitcher widget.LanguageSwitcherStyle
}

func NewHome(app core.Application) gio_router.RouteView {
	langSwitcher := widget.NewLanguageSwitcher(app.LocalizerManager())

	return &Home{
		app:          app,
		langSwitcher: langSwitcher,
	}
}

func (h *Home) Layout(gtx layout.Context) layout.Dimensions {
	theme := h.app.Theme()
	return h.langSwitcher.Layout(gtx, theme)
}

func (h *Home) OnIntent(intent gio_router.Intent) error {
	err := h.BaseScreen.OnIntent(intent)
	if err != nil {
		return err
	}

	go func() {
		time.Sleep(5 * time.Second)

		router := h.app.Router()
		router.RequestSwitch(route.Media(v1.MediaId{}))
	}()

	return nil
}

func (h *Home) Id() gio_router.Route {
	return route.HomeRoute
}

func (h *Home) Title(_ context.Context) string {
	localizer := h.app.Localizer()

	return localizer.T("page.home.title")
}
