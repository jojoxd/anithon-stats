package screens

import (
	"gioui.org/layout"
	"git.jojoxd.nl/projects/go-giorno/router/intent"

	"anistats/internal/app/core"
)

type Search struct {
	app core.Application
}

func NewSearch(app core.Application) *Search {
	return &Search{
		app: app,
	}
}

func (s Search) Layout(gtx layout.Context) layout.Dimensions {
	// TODO implement me
	panic("implement me")
}

func (s Search) OnIntent(intent intent.Base) {
	// TODO implement me
	panic("implement me")
}
