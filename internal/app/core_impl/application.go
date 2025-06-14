package core_impl

import (
	"log/slog"

	"gioui.org/app"
	"gioui.org/layout"
	"gioui.org/op"
	"gioui.org/widget/material"

	"anistats/internal/app/api"
	"anistats/internal/app/core"
	"anistats/internal/app/core_impl/views"
	"anistats/internal/app/resources"
	"anistats/internal/config"
	"anistats/pkg/gio_kit/gkasync"
	"anistats/pkg/gio_kit/gkrouter"
)

var _ core.Application = (*Application)(nil)

type Application struct {
	window           *app.Window
	theme            *material.Theme
	rootView         *views.Root
	localizerManager *localizerManager
	logger           *slog.Logger
	clientBundle     api.ClientBundle
	router           gkrouter.Manager
	gkAsyncScheduler gkasync.Scheduler
}

func NewApplication(window *app.Window) (*Application, error) {
	bundles, err := res.GetLangBundles()
	if err != nil {
		return nil, err
	}

	localizerManager, err := newLocalizerManager(bundles, res.LangEnglish)
	if err != nil {
		return nil, err
	}

	clientBundle, err := api.NewClientBundle(config.AppClient{
		Type: config.ClientTypeEmbedded,
	})
	if err != nil {
		return nil, err
	}

	router := gkrouter.NewManager(window,
		gkrouter.Logger(slog.Default()),
		gkrouter.ManageWindowTitle(config.AppName),
	)

	gkAsyncScheduler := gkasync.NewPoolScheduler(window,
		gkasync.Logger(slog.Default()),
		gkasync.Workers(4),
	)

	application := &Application{
		window:           window,
		router:           router,
		theme:            material.NewTheme(),
		localizerManager: localizerManager,
		clientBundle:     clientBundle,
		logger:           slog.Default(),
		gkAsyncScheduler: gkAsyncScheduler,
	}

	return application, nil
}

func (a *Application) Loop() error {
	var ops op.Ops

	for {
		a.logger.Info("loop")

		switch ev := a.window.Event().(type) {
		case app.DestroyEvent:
			a.logger.Info("eventLoop: destroy")
			return ev.Err

		case app.FrameEvent:
			gtx := app.NewContext(&ops, ev)

			a.layout(gtx)
			ev.Frame(gtx.Ops)
		}
	}
}

func (a *Application) Logger() *slog.Logger {
	return a.logger
}

func (a *Application) layout(gtx layout.Context) layout.Dimensions {
	if a.rootView == nil {
		a.rootView = views.NewRoot(a)
	}

	return a.rootView.Layout(gtx)
}

func (a *Application) Localizer() core.Localizer {
	return a.localizerManager.Localizer()
}

func (a *Application) LocalizerManager() core.LocalizerManager {
	return a.localizerManager
}

func (a *Application) Theme() *material.Theme {
	return a.theme
}

func (a *Application) ApiClient() api.ClientBundle {
	return a.clientBundle
}

func (a *Application) Router() gkrouter.Manager {
	return a.router
}

func (a *Application) GkAsyncScheduler() gkasync.Scheduler {
	return a.gkAsyncScheduler
}
