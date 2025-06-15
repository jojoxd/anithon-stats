package app

import (
	"context"
	"log"
	"log/slog"
	"os"

	gapp "gioui.org/app"

	"anistats/internal/app/core_impl"
)

func Main(ctx context.Context) {
	window := new(gapp.Window)

	slog.SetLogLoggerLevel(slog.LevelDebug)

	app, err := core_impl.NewApplication(window)
	if err != nil {
		log.Fatal(err)
	}

	go func() {
		err := app.Run(ctx)
		if err != nil {
			log.Fatal(err)
		}

		os.Exit(0)
	}()

	gapp.Main()
}
