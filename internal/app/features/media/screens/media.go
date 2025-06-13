package screens

import (
	"context"
	"errors"

	"gioui.org/layout"
	"gioui.org/widget/material"
	"github.com/google/uuid"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/internal/app/core/route"
	"anistats/internal/app/features/media/widget"
	"anistats/pkg/anistats_client"
	"anistats/pkg/gio_kit/gkasync"
	"anistats/pkg/gio_kit/gkloader"
	"anistats/pkg/gio_router"
)

type Media struct {
	gio_router.BaseScreen
	app       core.Application
	mediaCard *widget.MediaCardStyle
	loader    gkloader.GkLoaderStyle
}

type MediaParams struct {
	MediaId v1.MediaId
}

func NewMedia(app core.Application) gio_router.RouteView {
	return &Media{
		app:       app,
		mediaCard: widget.MediaCard(app),
		loader:    gkloader.New(gkloader.NewSchedulerController(app.GkScheduler(), loadMedia)),
	}
}

func (m *Media) Layout(gtx layout.Context) layout.Dimensions {
	logger := m.app.Logger()

	logger.Debug("render media screen")

	msvc := m.app.ApiClient().MediaService()

	media, _ := msvc.Media(v1.MediaId(uuid.MustParse("0197568d-6e5b-7d67-b9d5-d244fec5a766")))
	return m.layoutLoaded(gtx, &media)
}

func (m *Media) layoutLoading(gtx layout.Context) layout.Dimensions {
	theme := m.app.Theme()

	return material.H1(theme, "Loading").Layout(gtx)
}

func (m *Media) layoutLoaded(gtx layout.Context, media *v1.Media) layout.Dimensions {
	return m.mediaCard.Layout(gtx, media)
}

func (m *Media) OnIntent(intent gio_router.Intent) error {
	err := m.BaseScreen.OnIntent(intent)
	if err != nil {
		return err
	}

	return nil
}

func (m *Media) Id() gio_router.Route {
	return route.MediaRoute
}

func (m *Media) Title() string {
	// localizer := core.LocalizerFromContext(ctx)
	//
	// media := m.loader.Data()
	// if media != nil {
	// 	return localizer.PageTitle("page.media.media.title", map[string]string{
	// 		"Name": localizer.TTv1(media.DisplayName),
	// 	})
	// }

	localizer := m.app.Localizer()

	return localizer.PageTitle("page.media.media.loading", nil)
}
