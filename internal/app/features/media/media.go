package media

import (
	v1 "anistats/api/v1"
	"anistats/internal/app/features/media/screens"
	"anistats/pkg/gio_router"
)

func Register(mgr gio_router.Manager) {
	mgr.Register(screens.OverviewId, screens.NewOverview)
	mgr.Register(screens.MediaId, screens.NewMedia)
}

func OverviewIntent() gio_router.Intent {
	return gio_router.Intent{
		Target: screens.OverviewId,
	}
}

func MediaIntent(mediaId v1.MediaId) gio_router.Intent {
	return gio_router.Intent{
		Target: screens.MediaId,
		Params: screens.MediaParams{
			MediaId: mediaId,
		},
	}
}
