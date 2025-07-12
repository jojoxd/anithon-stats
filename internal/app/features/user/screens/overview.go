package screens

import (
	"gioui.org/layout"
	"gioui.org/widget/material"
	"git.jojoxd.nl/projects/go-giorno/loader"
	"git.jojoxd.nl/projects/go-giorno/router/intent"
	"github.com/google/uuid"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/internal/app/features/user/provider"
)

type Overview struct {
	app core.Application

	userProvider *provider.User
}

func NewOverview(app core.Application) *Overview {
	return &Overview{
		app:          app,
		userProvider: provider.NewUser(app),
	}
}

func (o Overview) Layout(gtx layout.Context) layout.Dimensions {
	th := o.app.Theme()

	return o.userProvider.Layout(gtx, loader.Slots[v1.User]{
		Loading: func(gtx layout.Context) layout.Dimensions {
			return material.Loader(th).Layout(gtx)
		},
		Loaded: func(gtx layout.Context, user v1.User) layout.Dimensions {
			return material.Body1(th, user.Name).Layout(gtx)
		},
	}.Layout)
}

func (o Overview) OnIntent(intent intent.Base) {}

func (o Overview) OnParameter(userId uuid.UUID) {
	o.userProvider.Load(userId)
}
