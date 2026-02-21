package view

import (
	"gioui.org/layout"
	"git.jojoxd.nl/projects/go-giorno/loader"
	"git.jojoxd.nl/projects/go-giorno/router/intent"
	"git.jojoxd.nl/projects/go-giorno/router/view"
	"github.com/google/uuid"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/internal/app/features/user/provider"
)

type UserView struct {
	view.TypedView[uuid.UUID]

	userProvider *provider.User
	widget       UserViewWidget
}

type UserViewWidget interface {
	Layout(gtx layout.Context, user v1.User) layout.Dimensions
}

func NewUserView(app core.Application, widget UserViewWidget) *UserView {
	return &UserView{
		userProvider: provider.NewUser(app),
		widget:       widget,
	}
}

func (v UserView) Layout(gtx layout.Context) layout.Dimensions {
	return v.userProvider.Layout(gtx, loader.Slots[v1.User]{
		Loading: func(gtx layout.Context) layout.Dimensions {
			return layout.Dimensions{}
		},
		Loaded: v.widget.Layout,
	}.Layout)
}

func (v UserView) OnParameter(userId uuid.UUID) {
	v.userProvider.Load(userId)
}

func (v UserView) OnIntent(intent intent.Base) {}
