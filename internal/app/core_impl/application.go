package core_impl

import (
	"context"

	"gioui.org/app"
	"gioui.org/layout"
	"gioui.org/op"
	"gioui.org/widget/material"

	"anistats/internal/app/core"
	"anistats/internal/app/core_impl/views"
	"anistats/internal/app/res"
	"anistats/internal/config"
)

type Application struct {
	window           *app.Window
	theme            *material.Theme
	rootView         *views.Root
	localizerManager *localizerManager
}

func NewApplication(cfg *config.App, window *app.Window) *Application {
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
	}
}

func (a *Application) Loop() error {
	var ops op.Ops

	for {
		switch ev := a.window.Event().(type) {
		case app.DestroyEvent:
			return ev.Err

		case app.FrameEvent:
			gtx := app.NewContext(&ops, ev)

			a.layout(gtx)
			ev.Frame(gtx.Ops)
		}
	}
}

func (a *Application) layout(gtx layout.Context) layout.Dimensions {
	ctx := newAppContext(context.TODO(), a)

	if a.rootView == nil {
		a.rootView = views.NewRoot(a.window)
	}

	return a.rootView.Layout(ctx, gtx)
}

func (a *Application) Localizer() core.Localizer {
	return a.localizerManager.Localizer()
}

func (a *Application) Theme() *material.Theme {
	return a.theme
}

func newAppContext(ctx context.Context, app *Application) context.Context {
	return context.WithValue(ctx, core.AppContextKey, app)
}
