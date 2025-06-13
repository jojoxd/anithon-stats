package route

import "anistats/pkg/gio_router"

var HomeRoute = gio_router.NewRoute("home.home")

func Home() gio_router.Intent {
	return gio_router.Intent{
		Target: HomeRoute,
	}
}
