package home

import (
	"anistats/internal/app/core"
	"anistats/internal/app/core/route"
	"anistats/internal/app/core/screen"
	"anistats/internal/app/features/home/screens"
	"anistats/pkg/gio_kit/gkrouter"
)

func Register(app core.Application, mgr gkrouter.Manager) error {
	err := mgr.Register(route.HomeRoute, screen.WithApp(app, screens.NewHome))
	if err != nil {
		return err
	}

	return nil
}
