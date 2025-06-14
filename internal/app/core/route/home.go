package route

import (
	"anistats/pkg/gio_kit/gkrouter"
)

var HomeRoute = gkrouter.NewRoute("home.home")

func Home() gkrouter.Intent {
	return gkrouter.Intent{
		Target: HomeRoute,
	}
}
