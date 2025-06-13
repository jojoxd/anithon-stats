package app

import (
	"log"
	"log/slog"
	"os"

	"gioui.org/app"

	"anistats/internal/app/core_impl"
)

func Main() {
	window := new(app.Window)

	slog.SetLogLoggerLevel(slog.LevelDebug)

	a := core_impl.NewApplication(window)

	go func() {
		err := a.Loop()
		a.Logger().Info("Application loop terminated", err)
		if err != nil {
			log.Fatal(err)
		}

		os.Exit(0)
	}()

	app.Main()
}
