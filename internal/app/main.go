package app

import (
	"gioui.org/app"

	"anistats/internal/app/core_impl"
	"anistats/internal/config"
)

func Main(cfg *config.App) {
	window := new(app.Window)

	a := core_impl.NewApplication(cfg, window)
	go a.Loop()

	app.Main()
}
