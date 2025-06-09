package app

import (
	"context"
	"log"
	"log/slog"
	"os"

	"gioui.org/app"

	"anistats/internal/app/core_impl"
)

func Main(ctx context.Context) {
	window := new(app.Window)

	slog.SetLogLoggerLevel(slog.LevelDebug)

	a := core_impl.NewApplication(window)

	go func() {
		err := a.Loop(ctx)
		a.Logger().Info("Application loop terminated", err)
		if err != nil {
			log.Fatal(err)
		}

		os.Exit(0)
	}()

	app.Main()
}
