package main

import (
	"log"
	"os"

	"gioui.org/app"
	"gioui.org/layout"
	"gioui.org/op"

	"anistats/test"
	"anistats/test/intent"
)

type context struct {
	router test.Router
}

func main() {
	ctx := context{
		router: test.NewRouter(),
	}

	go func() {
		window := new(app.Window)
		if err := run(window, ctx); err != nil {
			log.Fatal(err)
		}

		os.Exit(0)
	}()

	ctx.router.Push()

	app.Main()
}

func run(window *app.Window, ctx context) error {
	var ops op.Ops

	for {
		switch ev := window.Event().(type) {
		case app.DestroyEvent:
			return ev.Err

		case app.FrameEvent:
			gtx := app.NewContext(&ops, ev)

			frame(gtx, ctx)

			ev.Frame(gtx.Ops)
		}
	}
}

func frame(gtx layout.Context, ctx context) {
	ctx.router.Current().Layout(gtx)
}
