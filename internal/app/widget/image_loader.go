package widget

import (
	"context"
	"image"

	"gioui.org/layout"

	"anistats/pkg/gio_kit/gkasync"
	"anistats/pkg/gio_kit/gkloader"
)

type ImageLoaderStyle struct {
	loader *gkloader.GkLoaderStyle
}

type ImageLoaderFn func(ctx context.Context, args ...interface{}) (image.Image, error)
type ImageLoaderWidget func(gtx layout.Context, image image.Image) layout.Dimensions

func (l ImageLoaderFn) Load(ctx context.Context, args ...interface{}) (interface{}, error) {
	return l(ctx, args...)
}

func NewImageLoader(scheduler gkasync.Scheduler, loader ImageLoaderFn) *ImageLoaderStyle {
	return &ImageLoaderStyle{
		loader: gkloader.NewScheduler(scheduler, loader.Load),
	}
}

func (s *ImageLoaderStyle) Load(args ...interface{}) {
	s.loader.Load(args...)
}

func (s *ImageLoaderStyle) Layout(gtx layout.Context, w ImageLoaderWidget) layout.Dimensions {
	if img, ok := s.loader.Data().(image.Image); ok {
		return w(gtx, img)
	}

	return w(gtx, nil)
}
