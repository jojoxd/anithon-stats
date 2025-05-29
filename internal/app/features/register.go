package features

import (
	"anistats/internal/app/features/home"
	"anistats/internal/app/features/media"
	"anistats/pkg/gio_router"
)

func Register(vm gio_router.Manager) {
	home.Register(vm)
	media.Register(vm)
}
