package core_impl

import (
	"gioui.org/app"
	"gioui.org/layout"
	"gioui.org/op"
	"github.com/oligo/gioview/theme"

	"anistats/internal/app/core_impl/views"
	"anistats/internal/config"
)

type Application struct {
	window   *app.Window
	theme    *theme.Theme
	rootView *views.Root
}

func NewApplication(cfg *config.App, window *app.Window) *Application {
	th := theme.NewTheme("fonts", nil, false)

	return &Application{
		window: window,
		theme:  th,
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
	if a.rootView == nil {
		a.rootView = views.NewRoot(a.window)
	}

	return a.rootView.Layout(gtx, a.theme)
}
