package screens

import (
	"gioui.org/layout"

	"anistats/internal/app/core"
	"anistats/pkg/gio_kit/gkrouter"
)

type Overview struct {
	gkrouter.BaseScreen
	app core.Application
}

func NewOverview(app core.Application) gkrouter.RouteView {
	return &Overview{
		app: app,
	}
}

func (o *Overview) Layout(gtx layout.Context) layout.Dimensions {
	// TODO implement me
	panic("implement me")
}

func (o *Overview) OnIntent(intent gkrouter.Intent) error {
	err := o.BaseScreen.OnIntent(intent)
	if err != nil {
		return err
	}

	return nil
}

func (o *Overview) Id() gkrouter.Route {
	// TODO implement me
	panic("implement me")
}

func (o *Overview) Title() string {
	localizer := o.app.Localizer()

	return localizer.T("media.overview.title")
}
