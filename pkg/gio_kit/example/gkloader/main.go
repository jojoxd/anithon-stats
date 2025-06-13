package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"gioui.org/app"
	"gioui.org/layout"
	"gioui.org/op"
	"gioui.org/widget/material"

	"anistats/pkg/gio_kit/gkasync"
	"anistats/pkg/gio_kit/gkloader"
)

func main() {
	window := new(app.Window)

	scheduler := gkasync.NewPoolScheduler(window, 3)
	controller := gkloader.NewSchedulerController(scheduler, loadData)

	a := App{
		window:    window,
		scheduler: scheduler,
		loader:    gkloader.NewController(controller),
		theme:     material.NewTheme(),
	}
	a.Run()
}

func loadData(ctx context.Context, args ...interface{}) (interface{}, error) {
	fmt.Printf("main.go: loadData called, sleeping for 10 seconds\n")
	time.Sleep(10 * time.Second)
	fmt.Printf("main.go: loadData completed\n")

	return "Hello, World", nil
}

type App struct {
	window    *app.Window
	scheduler gkasync.Scheduler
	loader    *gkloader.GkLoaderStyle
	theme     *material.Theme
}

func (a App) Run() {
	go func() {
		if err := a.loop(a.window); err != nil {
			log.Fatal(err)
		}

		os.Exit(1)
	}()

	go func() {
		time.Sleep(5 * time.Second)
		fmt.Printf("main.go: start loading\n")

		a.loader.Load("1")
	}()

	app.Main()
}

func (a App) loop(window *app.Window) error {
	var ops op.Ops

	for {
		switch ev := window.Event().(type) {
		case app.DestroyEvent:
			return ev.Err

		case app.FrameEvent:
			gtx := app.NewContext(&ops, ev)

			fmt.Printf("main.go: frame event %v\n", ev)
			a.layout(gtx)

			ev.Frame(gtx.Ops)
		}
	}
}

func (a App) layout(gtx layout.Context) layout.Dimensions {
	fmt.Printf("main.go: app layout called\n")

	return a.loader.Layout(gtx, gkloader.Slots[string]{
		Initial: func(gtx layout.Context) layout.Dimensions {
			return material.Body1(a.theme, "Initial").Layout(gtx)
		},

		Error: func(gtx layout.Context, err error) layout.Dimensions {
			fmt.Printf("main.go: error %v\n", err)

			return material.Body1(a.theme, err.Error()).Layout(gtx)
		},

		Queued: func(gtx layout.Context) layout.Dimensions {
			return material.Body1(a.theme, "Queued").Layout(gtx)
		},

		Loading: func(gtx layout.Context) layout.Dimensions {
			fmt.Printf("Loading slot called\n")

			return material.Loader(a.theme).Layout(gtx)
		},

		Loaded: func(gtx layout.Context, data string) layout.Dimensions {
			fmt.Printf("Loaded slot called\n")

			return material.Body1(a.theme, data).Layout(gtx)
		},
	}.Layout)
}

func (a App) layoutLoader(gtx layout.Context, state gkloader.State) layout.Dimensions {
	fmt.Printf("rerender with state: %#v\n", state)

	return layout.Dimensions{}
}
