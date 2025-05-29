package views

import (
	"time"

	"gioui.org/app"
	"gioui.org/layout"
	"gioui.org/widget/material"
	"github.com/oligo/gioview/theme"

	v1 "anistats/api/v1"
	"anistats/internal/app/features"
	"anistats/internal/app/features/media"
	"anistats/pkg/gio_router"
)

type Root struct {
	vm gio_router.Manager
}

func NewRoot(window *app.Window) *Root {
	vm := gio_router.NewManager(window)

	features.Register(vm)

	go func() {
		time.Sleep(1 * time.Second)

		vm.RequestSwitch(media.MediaIntent(v1.MediaId("1")))
	}()

	return &Root{
		vm: vm,
	}
}

func (r Root) Layout(gtx layout.Context, th *theme.Theme) layout.Dimensions {
	return layout.Flex{}.Layout(gtx,
		layout.Flexed(1, func(gtx layout.Context) layout.Dimensions {
			currentView := r.vm.CurrentView()
			if currentView == nil {
				return material.H1(th.Theme, "No RouteView").Layout(gtx)
			}

			return currentView.Layout(gtx, th)
		}),
	)
}
