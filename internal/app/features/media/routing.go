package media

import (
	"anistats/internal/app/core"
	"anistats/internal/app/core/route"
	"anistats/internal/app/core/screen"
	"anistats/internal/app/features/media/screens"
	"anistats/pkg/giorno/router"
)

func Register(app core.Application, mgr router.Manager) error {
	var err error

	err = mgr.Register(route.MediaOverviewRoute, screen.WithApp(app, screens.NewOverview))
	if err != nil {
		return err
	}

	err = mgr.Register(route.MediaRoute, screen.WithApp(app, screens.NewMedia))
	if err != nil {
		return err
	}

	return nil
}
