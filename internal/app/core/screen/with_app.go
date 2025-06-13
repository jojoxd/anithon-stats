package screen

import (
	"anistats/internal/app/core"
	"anistats/pkg/gio_router"
)

type RouteProvider func(app core.Application) gio_router.RouteView

func WithApp(app core.Application, provider RouteProvider) gio_router.RouteProvider {
	return func() gio_router.RouteView {
		return provider(app)
	}
}
