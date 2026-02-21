package screens

import (
	"gioui.org/layout"
	"git.jojoxd.nl/projects/go-giorno/router/intent"
	"github.com/google/uuid"

	"anistats/internal/app/core"
)

type Overview struct {
	app core.Application
}

func NewOverview(app core.Application) *Overview {
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

func (o Overview) OnParameter(userlistId uuid.UUID) {
	// TODO implement me
	panic("implement me")
}
