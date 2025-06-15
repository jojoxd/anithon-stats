package main

import (
	"context"
	"fmt"
	"log/slog"
	"math/rand/v2"
	"time"

	"gioui.org/app"
	"gioui.org/layout"
	"gioui.org/widget/material"

	"anistats/pkg/gio_kit/contract"
	"anistats/pkg/gio_kit/example/base"
	"anistats/pkg/gio_kit/gkasync"
	"anistats/pkg/gio_kit/gkasync/fixedpool"
	"anistats/pkg/gio_kit/gkloader"
	"anistats/pkg/gio_kit/internal"
)

func main() {
	window := new(app.Window)

	// can also be just standard slog.Default()
	logger := internal.NewPrefixLogger("root", slog.Default())

	scheduler := fixedpool.NewScheduler(window,
		fixedpool.Logger(logger),
		fixedpool.Workers(3),
	)

	controller := gkloader.NewLoaderController(scheduler, &dataLoader{
		logger: internal.NewPrefixLogger("dataLoader", logger),
	})

	e := &example{
		loader: gkloader.New(controller),
		theme:  material.NewTheme(),
		logger: logger,
	}

	go func() {
		i, q := 0, 0
		for {
			random := time.Duration(rand.IntN(5000))
			time.Sleep(random * time.Millisecond)

			e.loader.Load(i)

			q++

			if q%2 == 0 {
				i++
			}
		}
	}()

	base.Run(window, e.frame)
}

type example struct {
	scheduler gkasync.Scheduler
	logger    contract.Logger
	loader    *gkloader.Style[int, string]
	theme     *material.Theme
}

func (e example) frame(gtx layout.Context) {
	e.loader.Layout(gtx, gkloader.Slots[string]{
		Initial: func(gtx layout.Context) layout.Dimensions {
			e.logger.Debug("execute slot 'Initial'")
			return material.Body1(e.theme, "Initial Slot").Layout(gtx)
		},

		Error: func(gtx layout.Context, err error) layout.Dimensions {
			e.logger.Debug("execute slot 'Error'")
			return material.Body1(e.theme, err.Error()).Layout(gtx)
		},

		Queued: func(gtx layout.Context) layout.Dimensions {
			e.logger.Debug("execute slot 'Queued'")
			return material.Body1(e.theme, "Queued Slot").Layout(gtx)
		},

		Loading: func(gtx layout.Context) layout.Dimensions {
			e.logger.Debug("execute slot 'Loading'")
			return material.Body1(e.theme, "Loading Slot").Layout(gtx)
		},

		Loaded: func(gtx layout.Context, data string) layout.Dimensions {
			e.logger.Debug("execute slot 'Loaded'")
			return material.Body1(e.theme, data).Layout(gtx)
		},
	}.Layout)
}

type dataLoader struct {
	logger contract.Logger
}

func (d dataLoader) Load(ctx context.Context, arg int) (string, error) {
	d.logger.Debug(fmt.Sprintf("loading with arg %d, will take 1s", arg))

	select {
	case <-ctx.Done():
		d.logger.Debug("context canceled", "err", ctx.Err(), "arg", arg)
		return "", ctx.Err()
	case <-time.After(1 * time.Second):
		return fmt.Sprintf("hello, world: %d", arg), nil
	}
}
