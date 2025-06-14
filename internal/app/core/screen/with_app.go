package screen

import (
	"anistats/internal/app/core"
	"anistats/pkg/gio_kit/gkrouter"
)

type RouteProvider func(app core.Application) gkrouter.RouteView

func WithApp(app core.Application, provider RouteProvider) gkrouter.RouteProvider {
	return func() gkrouter.RouteView {
		return provider(app)
	}
}
