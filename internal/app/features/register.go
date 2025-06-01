package features

import (
	"anistats/internal/app/features/home"
	"anistats/internal/app/features/media"
	"anistats/pkg/gio_router"
)

func Register(mgr gio_router.Manager) {
	home.Register(mgr)
	media.Register(mgr)
}
