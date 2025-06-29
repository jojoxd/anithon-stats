package screens

import (
	"gioui.org/layout"

	"anistats/internal/app/core"
	"anistats/pkg/giorno/router"
)

type Overview struct {
	router.BaseScreen
	app core.Application
}

func NewOverview(app core.Application) router.RouteView {
	return &Overview{
		app: app,
	}
}

func (o *Overview) Layout(gtx layout.Context) layout.Dimensions {
	// TODO implement me
	panic("implement me")
}

func (o *Overview) OnIntent(intent router.Intent) error {
	err := o.BaseScreen.OnIntent(intent)
	if err != nil {
		return err
	}

	return nil
}

func (o *Overview) Id() router.Route {
	// TODO implement me
	panic("implement me")
}

func (o *Overview) Title() string {
	localizer := o.app.Localizer()

	return localizer.T("media.overview.title")
}
