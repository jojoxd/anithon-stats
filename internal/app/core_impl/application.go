package core_impl

import (
	"context"
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
	"anistats/pkg/giorno/async"
	"anistats/pkg/giorno/async/fixedpool"
	"anistats/pkg/giorno/localizer"
	"anistats/pkg/giorno/router"
)

var _ core.Application = (*Application)(nil)

type Application struct {
	window           *app.Window
	theme            *material.Theme
	rootView         *views.Root
	localizerManager localizer.Manager
	logger           *slog.Logger
	clientBundle     api.ClientBundle
	router           router.Manager
	gkAsyncScheduler async.Scheduler
}

func NewApplication(window *app.Window) (*Application, error) {
	bundle, err := res.LocaleBundle()
	if err != nil {
		return nil, err
	}

	localizerManager, err := localizer.NewGoI18nManager(bundle, res.LocaleEnglish)
	if err != nil {
		return nil, err
	}

	clientBundle, err := api.NewClientBundle(config.AppClient{
		Type: config.ClientTypeEmbedded,
	})
	if err != nil {
		return nil, err
	}

	router := router.NewManager(window,
		router.Logger(slog.Default()),
		router.ManageWindowTitle(config.AppName),
	)

	gkAsyncScheduler := fixedpool.NewScheduler(window,
		fixedpool.Logger(slog.Default()),
		fixedpool.Workers(4),
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

func (a *Application) Run(ctx context.Context) error {
	var ops op.Ops

	eventCtx, cancelEventHandler := context.WithCancel(ctx)

	go func() {
		a.handleEvents(eventCtx)
	}()

	for {
		a.logger.Debug("loop")

		switch ev := a.window.Event().(type) {
		case app.DestroyEvent:
			a.logger.Debug("eventLoop: destroy")
			cancelEventHandler()
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

func (a *Application) Localizer() localizer.Localizer {
	return a.localizerManager.Localizer()
}

func (a *Application) LocalizerManager() localizer.Manager {
	return a.localizerManager
}

func (a *Application) Theme() *material.Theme {
	return a.theme
}

func (a *Application) ApiClient() api.ClientBundle {
	return a.clientBundle
}

func (a *Application) Router() router.Manager {
	return a.router
}

func (a *Application) GkAsyncScheduler() async.Scheduler {
	return a.gkAsyncScheduler
}

func (a *Application) handleEvents(ctx context.Context) {
	for {
		select {
		case ev := <-a.localizerManager.Events():
			a.handleLocalizerEvent(ev)

		case <-ctx.Done():
			panic("context canceled")
		}
	}
}

func (a *Application) handleLocalizerEvent(ev localizer.LocalizerManagerEvent) {
	switch ev := ev.(type) {
	case localizer.LocaleChangedEvent:
		a.logger.Info("Locale changed", "old", ev.OldLocale, "new", ev.NewLocale)
		a.window.Invalidate()

	case localizer.LocalizationNotFoundEvent:
		a.logger.Warn("localization not found",
			slog.String("key", ev.Key),
			slog.String("locale", ev.Locale.String()),
		)
	}
}
