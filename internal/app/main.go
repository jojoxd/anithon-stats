package app

import (
	"fmt"
	"log"
	"os"

	gioApp "gioui.org/app"
	"gioui.org/layout"
	gioUnit "gioui.org/unit"
	"gioui.org/widget/material"

	"anistats/internal/app/core"
	"anistats/internal/app/core_impl"
	"anistats/internal/app/feature/bootstrap"
	"anistats/internal/config"
	"anistats/pkg/gio_router"
)

func Main(cfg *config.App) {
	theme := material.NewTheme()

	root := func(gtx layout.Context, app core.AppContext) layout.Dimensions {
		rv := gio_router.NewView(app.Router())

		return rv.Layout(gtx)
	}

	app, err := core_impl.NewApplication(cfg, theme, root)
	if err != nil {
		log.Fatal(err)
	}

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
