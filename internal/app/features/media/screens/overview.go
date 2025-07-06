package screens

import (
	"gioui.org/layout"
	"git.jojoxd.nl/projects/go-giorno/router/intent"
	"git.jojoxd.nl/projects/go-giorno/router/view"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
)

type Overview struct {
	app core.Application
}

func NewOverview(app core.Application) view.TypedView[v1.MediaId] {
	return &Overview{
		app: app,
	}
}

func (o Overview) Layout(gtx layout.Context) layout.Dimensions {
	// TODO implement me
	panic("implement me")
}

func (o Overview) OnIntent(intent intent.Base) {
	// TODO implement me
	panic("implement me")
}

func (o Overview) OnParameter(mediaId v1.MediaId) {}
