package route

import (
	"anistats/pkg/giorno/router"
)

var HomeRoute = router.NewRoute("home.home")

func Home() router.Intent {
	return router.Intent{
		Target: HomeRoute,
	}
}
