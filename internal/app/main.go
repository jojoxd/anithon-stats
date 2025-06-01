package app

import (
	"log"
	"log/slog"
	"os"

	"gioui.org/app"

	"anistats/internal/app/core_impl"
	"anistats/internal/config"
)

func Main(cfg *config.App) {
	window := new(app.Window)

	slog.SetLogLoggerLevel(slog.LevelDebug)

	a := core_impl.NewApplication(cfg, window)

	go func() {
		err := a.Loop()
		if err != nil {
			log.Fatal(err)
		}

		os.Exit(0)
	}()

	app.Main()
}
