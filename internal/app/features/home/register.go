package home

import (
	"anistats/internal/app/features/home/screens"
	"anistats/pkg/gio_router"
)

func Register(vm gio_router.Manager) {
	vm.Register(screens.HomeId, screens.NewHome)
}
