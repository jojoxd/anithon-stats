package route

import (
	v1 "anistats/api/v1"
	"anistats/pkg/gio_kit/gkrouter"
)

var MediaRoute = gkrouter.NewRoute("media.media")

func Media(id v1.MediaId) gkrouter.Intent {
	return gkrouter.Intent{
		Target: MediaRoute,
		Params: MediaParams{
			MediaId: id,
		},
	}
}

type MediaParams struct {
	MediaId v1.MediaId
}

var MediaOverviewRoute = gkrouter.NewRoute("media.overview")

func MediaOverview() gkrouter.Intent {
	return gkrouter.Intent{
		Target: MediaOverviewRoute,
	}
}
