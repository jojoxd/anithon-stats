package screens

import (
	"context"

	"gioui.org/layout"

	"anistats/internal/app/core"
	"anistats/pkg/gio_router"
)

type Overview struct {
	gio_router.BaseScreen
	app core.Application
}

func NewOverview(app core.Application) gio_router.RouteView {
	return &Overview{
		app: app,
	}
}

func (o *Overview) Layout(gtx layout.Context) layout.Dimensions {
	// TODO implement me
	panic("implement me")
}

func (o *Overview) OnIntent(intent gio_router.Intent) error {
	err := o.BaseScreen.OnIntent(intent)
	if err != nil {
		return err
	}

	return nil
}

func (o *Overview) Id() gio_router.Route {
	// TODO implement me
	panic("implement me")
}

func (o *Overview) Title(ctx context.Context) string {
	localizer := core.LocalizerFromContext(ctx)

	return localizer.T("media.overview.title")
}
