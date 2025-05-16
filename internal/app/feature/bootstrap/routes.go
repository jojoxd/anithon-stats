package bootstrap

import (
	"anistats/internal/app/core"
	"anistats/internal/app/feature/bootstrap/page"
	"anistats/pkg/gio_router"
)

func Bootstrap() gio_router.RouteTarget[core.AppContext] {
	return page.Bootstrap.Bind(nil)
}
