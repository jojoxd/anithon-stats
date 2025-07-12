package screens

import (
	"gioui.org/layout"
	"git.jojoxd.nl/projects/go-giorno/router/intent"
	"github.com/google/uuid"

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

func (l Lists) OnParameter(userId uuid.UUID) {
	// TODO implement me
	panic("implement me")
}
