package media

import (
	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/internal/app/feature/media/page"
	"anistats/pkg/gio_router"
)

func Overview() gio_router.RouteTarget[core.AppContext] {
	return page.Overview.Bind(nil)
}

func Media(mediaId v1.MediaId) gio_router.RouteTarget[core.AppContext] {
	return page.Media.Bind(mediaId)
}
