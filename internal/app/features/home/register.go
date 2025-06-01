package home

import (
	"anistats/internal/app/features/home/screens"
	"anistats/pkg/gio_router"
)

func Register(mgr gio_router.Manager) {
	mgr.Register(screens.HomeId, screens.NewHome)
}

func HomeIntent() gio_router.Intent {
	return gio_router.Intent{
		Target: screens.HomeId,
	}
}
