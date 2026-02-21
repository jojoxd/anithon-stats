package screens

import (
	"gioui.org/layout"
	"git.jojoxd.nl/projects/go-giorno/router/intent"
	"github.com/google/uuid"

	"anistats/internal/app/core"
)

type Edit struct {
	app core.Application
}

func NewEdit(app core.Application) *Edit {
	return &Edit{
		app: app,
	}
}

func (e Edit) Layout(gtx layout.Context) layout.Dimensions {
	// TODO implement me
	panic("implement me")
}

func (e Edit) OnIntent(intent intent.Base) {
	// TODO implement me
	panic("implement me")
}

func (e Edit) OnParameter(userlistId uuid.UUID) {
	// TODO implement me
	panic("implement me")
}
