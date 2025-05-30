package app

import (
	"log/slog"

	"gioui.org/app"

	"anistats/internal/app/core_impl"
	"anistats/internal/config"
)

func Main(cfg *config.App) {
	window := new(app.Window)

	slog.SetLogLoggerLevel(slog.LevelDebug)

	a := core_impl.NewApplication(cfg, window)
	go a.Loop()

	app.Main()
}
