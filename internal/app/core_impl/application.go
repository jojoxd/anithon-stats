package core_impl

import (
	"log/slog"

	gioApp "gioui.org/app"
	gioOp "gioui.org/op"
	gioMaterial "gioui.org/widget/material"
	"golang.org/x/text/language"

	"anistats/internal/app/core"
	"anistats/internal/app/res"
	"anistats/internal/config"
	"anistats/pkg/gio_router"
)

var _ core.AppContext = (*Application)(nil)

type Application struct {
	config         *config.App
	materialTheme  *gioMaterial.Theme
	router         *gio_router.Router[core.AppContext]
	window         *gioApp.Window
	widget         core.Widget
	i18n           *localizerManager
	mediaLocalizer *mediaLocalizer
}

func NewApplication(config *config.App, materialTheme *gioMaterial.Theme, widget core.Widget) (*Application, error) {
	i18n, err := buildLocalizerManager()
	if err != nil {
		return nil, err
	}

	self := &Application{
		config:         config,
		materialTheme:  materialTheme,
		window:         new(gioApp.Window),
		widget:         widget,
		i18n:           i18n,
		mediaLocalizer: newMediaLocalizer(language.English, slog.Default()),
	}

	self.router = gio_router.NewRouter[core.AppContext](self, slog.Default())

	return self, nil
}

func buildLocalizerManager() (*localizerManager, error) {
	langBundles, err := res.GetLangBundles()
	if err != nil {
		return nil, err
	}

	manager, err := newLocalizerManager(langBundles)
	if err != nil {
		return nil, err
	}

	return manager, nil
}

func (a Application) MaterialTheme() *gioMaterial.Theme {
	return gioMaterial.NewTheme()
}

func (a Application) Router() *gio_router.Router[core.AppContext] {
	return a.router
}

func (a Application) Config() *config.App {
	return a.config
}

func (a Application) Window() *gioApp.Window {
	return a.window
}

func (a Application) I18n() core.Localizer {
	return a.i18n.Localizer()
}

func (a Application) SetLocale(lang language.Tag) error {
	err := a.i18n.SetLocale(lang)
	if err != nil {
		return err
	}

	// TODO: Move to SetMediaLocale, has a different set of locales available than app locales
	err = a.mediaLocalizer.SetLocale(lang)
	if err != nil {
		return err
	}

	// re-render
	a.window.Invalidate()

	return nil
}

func (a Application) MediaLocalizer() core.MediaLocalizer {
	return a.mediaLocalizer
}

func (a Application) Loop() error {
	var ops gioOp.Ops

	for {
		switch ev := a.window.Event().(type) {
		case gioApp.DestroyEvent:
			return ev.Err

		case gioApp.FrameEvent:
			gtx := gioApp.NewContext(&ops, ev)

			a.widget(gtx, a)

			ev.Frame(gtx.Ops)
		}
	}
}
