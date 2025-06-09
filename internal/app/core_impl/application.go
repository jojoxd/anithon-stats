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
)

var _ core.Application = (*Application)(nil)

type Application struct {
	window           *app.Window
	theme            *material.Theme
	rootView         *views.Root
	localizerManager *localizerManager
	logger           *slog.Logger
	clientBundle     api.ClientBundle
	runtimeConfig    core.RuntimeConfig
}

func NewApplication(window *app.Window) *Application {
	bundles, err := res.GetLangBundles()
	if err != nil {
		panic(err)
	}

	localizerManager, err := newLocalizerManager(bundles, res.LangEnglish)
	if err != nil {
		panic(err)
	}

	return &Application{
		window:           window,
		theme:            material.NewTheme(),
		localizerManager: localizerManager,
		logger:           slog.Default(),
		runtimeConfig:    NewRuntimeConfig(),
	}
}

func (a *Application) Loop(ctx context.Context) error {
	var ops op.Ops

	for {
		a.logger.Info("loop")

		switch ev := a.window.Event().(type) {
		case app.DestroyEvent:
			a.logger.Info("eventLoop: destroy")
			return ev.Err

		case app.FrameEvent:
			gtx := app.NewContext(&ops, ev)

			a.layout(ctx, gtx)
			ev.Frame(gtx.Ops)
		}
	}
}

func (a *Application) Logger() *slog.Logger {
	return a.logger
}

func (a *Application) layout(ctx context.Context, gtx layout.Context) layout.Dimensions {
	ctx = core.NewAppContext(ctx, a)

	if a.rootView == nil {
		a.rootView = views.NewRoot(a.window)
	}

	return a.rootView.Layout(ctx, gtx)
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

func (a *Application) RuntimeConfig() core.RuntimeConfig {
	return a.runtimeConfig
}
