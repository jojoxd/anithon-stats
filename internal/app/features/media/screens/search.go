package screens

import (
	"gioui.org/layout"
	"git.jojoxd.nl/projects/go-giorno/router/intent"
	"git.jojoxd.nl/projects/go-giorno/router/view"
	"github.com/google/uuid"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
)

type Search struct {
	app             core.Application
	selectedMediaId uuid.UUID
}

type SearchParams struct {
	OnResolve func(media v1.Media)
}

func NewSearch(app core.Application) view.TypedView[SearchParams] {
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

func (s Search) OnParameter(params SearchParams) {
	// TODO implement me
	panic("implement me")
}
