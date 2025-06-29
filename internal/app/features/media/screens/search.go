package screens

import (
	"gioui.org/layout"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/internal/app/core/route"
	"anistats/pkg/gio_kit/gkrouter"
)

type Search struct {
	gkrouter.BaseScreen
	app             core.Application
	selectedMediaId v1.MediaId
}

type SearchParams struct {
	OnResolve func(v1.MediaId)
}

func NewSearch(app core.Application) gkrouter.RouteView {
	return &Search{
		app: app,
	}
}

func (s Search) Id() gkrouter.Route {
	return route.MediaSearchRoute
}

func (s Search) Layout(gtx layout.Context) layout.Dimensions {
	// TODO implement me
	panic("implement me")
}

func (s Search) OnFinish() {
	p, ok := gkrouter.Params[SearchParams](s.Intent)
	if !ok {
		return
	}

	p.OnResolve(s.selectedMediaId)
}

func (s Search) Finished() bool {
	return true
}
