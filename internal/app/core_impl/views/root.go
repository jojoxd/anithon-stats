package views

import (
	"context"
	"log/slog"
	"time"

	"gioui.org/app"
	"gioui.org/layout"
	"gioui.org/widget/material"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/internal/app/features"
	"anistats/internal/app/features/media"
	"anistats/pkg/gio_router"
)

type Root struct {
	vm gio_router.Manager
}

func NewRoot(window *app.Window) *Root {
	vm := gio_router.NewManager(window, slog.Default())

	features.Register(vm)

	go func() {
		time.Sleep(1 * time.Second)

		vm.RequestSwitch(media.MediaIntent(v1.MediaId("1")))
	}()

	return &Root{
		vm: vm,
	}
}

func (r Root) Layout(ctx context.Context, gtx layout.Context) layout.Dimensions {
	theme := core.ThemeFromContext(ctx)

	return layout.Flex{}.Layout(gtx,
		layout.Flexed(1, func(gtx layout.Context) layout.Dimensions {
			currentView := r.vm.CurrentView()
			if currentView == nil {
				return material.H1(theme, "No RouteView").Layout(gtx)
			}

			ctx = r.vm.Context(ctx, gtx)
			return currentView.Layout(ctx)
		}),
	)
}
