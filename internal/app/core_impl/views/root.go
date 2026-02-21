package views

import (
	"gioui.org/layout"
	"git.jojoxd.nl/projects/go-giorno/ext/gmaterial/sheet"

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
	th := r.app.Theme()

	return sheet.Style{Color: th.Surface()}.Layout(gtx, func(gtx layout.Context) layout.Dimensions {
		return layout.Flex{}.Layout(gtx,
			layout.Flexed(1, func(gtx layout.Context) layout.Dimensions {
				return rtr.Current().Layout(gtx)
			}),
		)
	})
}
