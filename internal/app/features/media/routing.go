package media

import (
	"git.jojoxd.nl/projects/go-giorno/router"
	"git.jojoxd.nl/projects/go-giorno/router/route"
	"git.jojoxd.nl/projects/go-giorno/router/view"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/internal/app/core/routes"
	"anistats/internal/app/features/media/screens"
)

func Register(app core.Application, mgr router.Router) error {
	var err error

	err = mgr.Register(route.BindFactory(routes.MediaOverview, func() view.View {
		return screens.NewOverview(app)
	}))
	if err != nil {
		return err
	}

	err = mgr.Register(route.BindTypedFactory(routes.Media, func() view.TypedView[v1.MediaId] {
		return screens.NewMedia(app)
	}))
	if err != nil {
		return err
	}

	err = mgr.Register(route.BindTypedFactory(routes.MediaSearch, func() view.TypedView[screens.SearchParams] {
		return screens.NewSearch(app)
	}))
	if err != nil {
		return err
	}

	return nil
}
