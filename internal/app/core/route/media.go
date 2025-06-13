package route

import (
	v1 "anistats/api/v1"
	"anistats/pkg/gio_router"
)

var MediaRoute = gio_router.NewRoute("media.media")

func Media(id v1.MediaId) gio_router.Intent {
	return gio_router.Intent{
		Target: MediaRoute,
		Params: &MediaParams{
			MediaId: id,
		},
	}
}

type MediaParams struct {
	MediaId v1.MediaId
}

var MediaOverviewRoute = gio_router.NewRoute("media.overview")

func MediaOverview() gio_router.Intent {
	return gio_router.Intent{
		Target: MediaOverviewRoute,
	}
}
