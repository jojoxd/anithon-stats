package features

import (
	"git.jojoxd.nl/projects/go-giorno/router"

	"anistats/internal/app/core"
	"anistats/internal/app/features/home"
	"anistats/internal/app/features/media"
	"anistats/internal/app/features/user"
	"anistats/internal/app/features/userlist"
)

func Register(app core.Application, mgr router.Router) error {
	var err error

	err = home.Register(app, mgr)
	if err != nil {
		return err
	}

	err = media.Register(app, mgr)
	if err != nil {
		return err
	}

	err = userlist.Register(app, mgr)
	if err != nil {
		return err
	}

	err = user.Register(app, mgr)
	if err != nil {
		return err
	}

	return nil
}
