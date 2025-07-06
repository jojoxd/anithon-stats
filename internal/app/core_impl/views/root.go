package views

import (
	"gioui.org/layout"

	"anistats/internal/app/core"
	"anistats/internal/app/core/routes"
	"anistats/internal/app/features"
)

type Root struct {
	app core.Application
}

func NewRoot(app core.Application) *Root {
	err := features.Register(app, app.Router())
	if err != nil {
		panic(err)
	}

	app.Router().Push(routes.Home.Intent())

	return &Root{
		app: app,
	}
}

func (r Root) Layout(gtx layout.Context) layout.Dimensions {
	rtr := r.app.Router()

	return layout.Flex{}.Layout(gtx,
		layout.Flexed(1, func(gtx layout.Context) layout.Dimensions {
			return rtr.Current().Layout(gtx)
		}),
	)
}
