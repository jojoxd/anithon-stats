package screens

import (
	"gioui.org/layout"
	"git.jojoxd.nl/projects/go-giorno/router/intent"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
)

type Player struct {
	app core.Application
}

func NewPlayer(app core.Application) *Player {
	return &Player{
		app: app,
	}
}

func (p Player) Layout(gtx layout.Context) layout.Dimensions {
	// TODO implement me
	panic("implement me")
}

func (p Player) OnIntent(intent intent.Base) {
	// TODO implement me
	panic("implement me")
}

func (p Player) OnParameter(p2 v1.UserListId) {
	// TODO implement me
	panic("implement me")
}
