package screen

import (
	"anistats/internal/app/core"
	"anistats/pkg/giorno/router"
)

type RouteProvider func(app core.Application) router.RouteView

func WithApp(app core.Application, provider RouteProvider) router.RouteProvider {
	return func() router.RouteView {
		return provider(app)
	}
}
