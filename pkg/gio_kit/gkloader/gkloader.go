package gkloader

import (
	"gioui.org/layout"

	"anistats/pkg/gio_kit/gkasync"
)

type Widget func(gtx layout.Context, state State) layout.Dimensions

type GkLoaderStyle struct {
	controller Controller
}

func NewController(controller Controller) *GkLoaderStyle {
	return &GkLoaderStyle{
		controller: controller,
	}
}

func NewScheduler(scheduler gkasync.Scheduler, loader LoaderFn) *GkLoaderStyle {
	return &GkLoaderStyle{
		controller: NewSchedulerController(scheduler, loader),
	}
}

func (l *GkLoaderStyle) Layout(gtx layout.Context, widget Widget) layout.Dimensions {
	return widget(gtx, l.controller.State())
}

func (l *GkLoaderStyle) Load(args ...interface{}) {
	l.controller.Load(args...)
}
