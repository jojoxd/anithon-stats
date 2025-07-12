package provider

import (
	"context"

	"gioui.org/layout"
	"git.jojoxd.nl/projects/go-giorno/loader"
	"github.com/google/uuid"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
)

type User struct {
	loader *loader.Style[uuid.UUID, v1.User]
}

func NewUser(app core.Application) *User {
	return &User{
		loader: loader.New(NewUserController(app)),
	}
}

func (p *User) Layout(gtx layout.Context, slots loader.Widget[v1.User]) layout.Dimensions {
	return p.loader.Layout(gtx, slots)
}

func (p *User) Load(userId uuid.UUID) {
	p.loader.Load(userId)
}

func NewUserController(app core.Application) loader.Controller[uuid.UUID, v1.User] {
	return loader.NewLoaderController(app.GkAsyncScheduler(), &userLoader{
		app: app,
	})
}

type userLoader struct {
	app core.Application
}

func (ldr userLoader) Load(ctx context.Context, userId uuid.UUID) (v1.User, error) {
	ldr.app.Logger().Debug("provider.User: load", "userId", userId)
	return ldr.app.ApiClient().UserService().User(ctx, userId)
}
