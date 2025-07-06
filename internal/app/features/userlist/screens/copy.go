package screens

import (
	"gioui.org/layout"
	"git.jojoxd.nl/projects/go-giorno/router/intent"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
)

type Copy struct {
	app core.Application
}

func NewCopy(app core.Application) *Copy {
	return &Copy{
		app: app,
	}
}

func (c Copy) Layout(gtx layout.Context) layout.Dimensions {
	// TODO implement me
	panic("implement me")
}

func (c Copy) OnIntent(intent intent.Base) {
	// TODO implement me
	panic("implement me")
}

func (c Copy) OnParameter(p v1.UserListId) {
	// TODO implement me
	panic("implement me")
}
