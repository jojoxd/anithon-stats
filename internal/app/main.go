package app

import (
	"fmt"
	"log"
	"os"
	"time"

	gioApp "gioui.org/app"
	"gioui.org/layout"
	gioUnit "gioui.org/unit"
	"gioui.org/widget/material"

	"anistats/internal/app/core"
	"anistats/internal/app/core_impl"
	"anistats/internal/app/core_impl/screen"
	"anistats/internal/app/feature/bootstrap"
	"anistats/internal/config"
	"anistats/pkg/gio_router"
)

func Main(cfg *config.App) {
	theme := material.NewTheme()

	gs := globalState{Initialized: false}
	splash := screen.NewSplash(theme)

	root := func(gtx layout.Context, app core.AppContext) layout.Dimensions {
		if !gs.Initialized {
			return splash.Layout(gtx)
		}

		rv := gio_router.NewView(app.Router())

		return rv.Layout(gtx)
	}

	app, err := core_impl.NewApplication(cfg, theme, root)
	if err != nil {
		log.Fatal(err)
	}

	go func() {
		time.Sleep(5 * time.Second)

		gs.Initialized = true
		app.Router().Replace(bootstrap.Bootstrap())
		app.Window().Invalidate()
	}()

	app.Router().Push(bootstrap.Bootstrap())

	window := app.Window()

	window.Option(gioApp.Title(fmt.Sprintf("%s (%s)", config.AppName, config.AppVersion)))
	window.Option(gioApp.Size(gioUnit.Dp(1920), gioUnit.Dp(1080)))

	go func() {
		err := app.Loop()
		if err != nil {
			log.Fatal(err)
		}

		os.Exit(0)
	}()

	gioApp.Main()
}

type globalState struct {
	Initialized bool
}
