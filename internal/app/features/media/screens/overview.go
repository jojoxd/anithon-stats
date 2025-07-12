package screens

import (
	"gioui.org/layout"
	"git.jojoxd.nl/projects/go-giorno/router/intent"
	"git.jojoxd.nl/projects/go-giorno/router/view"
	"github.com/google/uuid"

	"anistats/internal/app/core"
)

type Overview struct {
	app core.Application
}

func NewOverview(app core.Application) view.TypedView[uuid.UUID] {
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

func (o Overview) OnParameter(mediaId uuid.UUID) {}
