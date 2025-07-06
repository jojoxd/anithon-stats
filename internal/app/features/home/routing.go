package home

import (
	"git.jojoxd.nl/projects/go-giorno/router"
	"git.jojoxd.nl/projects/go-giorno/router/route"
	"git.jojoxd.nl/projects/go-giorno/router/view"

	"anistats/internal/app/core"
	"anistats/internal/app/core/routes"
	"anistats/internal/app/features/home/screens"
)

func Register(app core.Application, mgr router.Router) error {
	var err error

	err = mgr.Register(route.BindFactory(routes.Home, func() view.View {
		return screens.NewHome(app)
	}))
	if err != nil {
		return err
	}

	return nil
}
