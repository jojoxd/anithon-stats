package screens

import (
	"gioui.org/layout"
	"git.jojoxd.nl/projects/go-giorno/router/intent"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
)

type Lists struct {
	app core.Application
}

func NewLists(app core.Application) *Lists {
	return &Lists{
		app: app,
	}
}

func (l Lists) Layout(gtx layout.Context) layout.Dimensions {
	// TODO implement me
	panic("implement me")
}

func (l Lists) OnIntent(intent intent.Base) {
	// TODO implement me
	panic("implement me")
}

func (l Lists) OnParameter(userId v1.UserId) {
	// TODO implement me
	panic("implement me")
}
