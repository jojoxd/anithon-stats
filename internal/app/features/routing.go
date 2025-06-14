package features

import (
	"anistats/internal/app/core"
	"anistats/internal/app/features/home"
	"anistats/internal/app/features/media"
	"anistats/pkg/gio_kit/gkrouter"
)

func Register(app core.Application, mgr gkrouter.Manager) error {
	var err error

	err = home.Register(app, mgr)
	if err != nil {
		return err
	}

	err = media.Register(app, mgr)
	if err != nil {
		return err
	}

	return nil
}
