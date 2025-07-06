package userlist

import (
	"git.jojoxd.nl/projects/go-giorno/router"
	"git.jojoxd.nl/projects/go-giorno/router/route"
	"git.jojoxd.nl/projects/go-giorno/router/view"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/internal/app/core/routes"
	"anistats/internal/app/features/userlist/screens"
)

func Register(app core.Application, mgr router.Router) error {
	var err error

	err = mgr.Register(route.BindTypedFactory(routes.UserListOverview, func() view.TypedView[v1.UserListId] {
		return screens.NewOverview(app)
	}))
	if err != nil {
		return err
	}

	err = mgr.Register(route.BindTypedFactory(routes.UserListCopy, func() view.TypedView[v1.UserListId] {
		return screens.NewCopy(app)
	}))
	if err != nil {
		return err
	}

	err = mgr.Register(route.BindTypedFactory(routes.UserListEdit, func() view.TypedView[v1.UserListId] {
		return screens.NewEdit(app)
	}))
	if err != nil {
		return err
	}

	err = mgr.Register(route.BindTypedFactory(routes.UserListPlayer, func() view.TypedView[v1.UserListId] {
		return screens.NewPlayer(app)
	}))
	if err != nil {
		return err
	}

	return nil
}
