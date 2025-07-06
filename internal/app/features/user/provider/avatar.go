package provider

import (
	"context"
	"image"

	"gioui.org/layout"
	"git.jojoxd.nl/projects/go-giorno/loader"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
)

type Avatar struct {
	loader *loader.Style[v1.UserId, image.Image]
}

func NewAvatar(app core.Application) *Avatar {
	return &Avatar{
		loader: loader.New(NewAvatarController(app)),
	}
}

func (p *Avatar) Layout(gtx layout.Context, id v1.UserId, slots loader.Widget[image.Image]) layout.Dimensions {
	p.loader.Load(id)

	return p.loader.Layout(gtx, slots)
}

func NewAvatarController(app core.Application) loader.Controller[v1.UserId, image.Image] {
	return loader.NewLoaderController(app.GkAsyncScheduler(), &avatarLoader{
		app: app,
	})
}

type avatarLoader struct {
	app core.Application
}

func (ldr avatarLoader) Load(ctx context.Context, userId v1.UserId) (image.Image, error) {
	ldr.app.Logger().Debug("provider.Avatar: load", "userId", userId)

	return ldr.app.ApiClient().UserService().Avatar(ctx, userId)
}
