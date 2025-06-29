package home

import (
	"anistats/internal/app/core"
	"anistats/internal/app/core/route"
	"anistats/internal/app/core/screen"
	"anistats/internal/app/features/home/screens"
	"anistats/pkg/giorno/router"
)

func Register(app core.Application, mgr router.Manager) error {
	err := mgr.Register(route.HomeRoute, screen.WithApp(app, screens.NewHome))
	if err != nil {
		return err
	}

	return nil
}
