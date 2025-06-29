package route

import (
	v1 "anistats/api/v1"
	"anistats/pkg/giorno/router"
)

var MediaRoute = router.NewRoute("media.media")

func Media(id v1.MediaId) router.Intent {
	return router.Intent{
		Target: MediaRoute,
		Params: MediaParams{
			MediaId: id,
		},
	}
}

type MediaParams struct {
	MediaId v1.MediaId
}

var MediaOverviewRoute = router.NewRoute("media.overview")

func MediaOverview() router.Intent {
	return router.Intent{
		Target: MediaOverviewRoute,
	}
}

var MediaSearchRoute = router.NewRoute("media.search")

type MediaSearchParams struct {
	OnResolve func(id v1.MediaId)
}

func MediaSearch(onResolve func(id v1.MediaId)) router.Intent {
	return router.Intent{
		Target: MediaSearchRoute,
		Params: MediaSearchParams{
			OnResolve: onResolve,
		},
	}
}
