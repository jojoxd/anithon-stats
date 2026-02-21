package user

import (
	"git.jojoxd.nl/projects/go-giorno/router"
	"git.jojoxd.nl/projects/go-giorno/router/route"
	"git.jojoxd.nl/projects/go-giorno/router/view"
	"github.com/google/uuid"

	"anistats/internal/app/core"
	"anistats/internal/app/core/routes"
	"anistats/internal/app/features/user/screens"
	view2 "anistats/internal/app/features/user/view"
)

func Register(app core.Application, mgr router.Router) error {
	var err error

	err = mgr.Register(route.BindTypedFactory(routes.UserOverview, func() view.TypedView[uuid.UUID] {
		return view2.NewUserView(app, screens.NewOverview(app))
	}))
	if err != nil {
		return err
	}

	err = mgr.Register(route.BindTypedFactory(routes.UserLists, func() view.TypedView[uuid.UUID] {
		return screens.NewLists(app)
	}))
	if err != nil {
		return err
	}

	err = mgr.Register(route.BindFactory(routes.UserSearch, func() view.View {
		return screens.NewSearch(app)
	}))
	if err != nil {
		return err
	}

	return nil
}
