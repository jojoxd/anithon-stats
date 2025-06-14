package screens

import (
	"context"
	"errors"

	"gioui.org/layout"
	"gioui.org/widget/material"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/internal/app/core/route"
	"anistats/internal/app/features/media/widget"
	"anistats/pkg/gio_kit/gkloader"
	"anistats/pkg/gio_kit/gkrouter"
)

type Media struct {
	gkrouter.BaseScreen
	app       core.Application
	mediaCard *widget.MediaCardStyle
	loader    *gkloader.GkLoaderStyle
}

type MediaParams struct {
	MediaId v1.MediaId
}

func NewMedia(app core.Application) gkrouter.RouteView {
	m := &Media{
		app:       app,
		mediaCard: widget.MediaCard(app),
	}

	m.loader = gkloader.NewScheduler(app.GkAsyncScheduler(), m.loadMedia)

	return m
}

func (m *Media) Layout(gtx layout.Context) layout.Dimensions {
	return m.loader.Layout(gtx, gkloader.Slots[v1.Media]{
		Loading: func(gtx layout.Context) layout.Dimensions {
			return material.Loader(m.app.Theme()).Layout(gtx)
		},
		Loaded: func(gtx layout.Context, data v1.Media) layout.Dimensions {
			return m.mediaCard.Layout(gtx, &data)
		},
	}.Layout)
}

func (m *Media) layoutLoading(gtx layout.Context) layout.Dimensions {
	theme := m.app.Theme()

	return material.H1(theme, "Loading").Layout(gtx)
}

func (m *Media) layoutLoaded(gtx layout.Context, media *v1.Media) layout.Dimensions {
	return m.mediaCard.Layout(gtx, media)
}

func (m *Media) OnIntent(intent gkrouter.Intent) error {
	err := m.BaseScreen.OnIntent(intent)
	if err != nil {
		return err
	}

	params, ok := intent.Params.(route.MediaParams)
	if !ok {
		return errors.New("invalid params type")
	}

	m.loader.Load(params.MediaId)

	return nil
}

func (m *Media) Id() gkrouter.Route {
	return route.MediaRoute
}

func (m *Media) Title() string {
	localizer := m.app.Localizer()

	if media, ok := m.loader.Data().(v1.Media); ok {
		return localizer.PageTitle("page.media.media.title", map[string]string{
			"Name": localizer.TTv1(media.DisplayName),
		})
	}

	return localizer.PageTitle("page.media.media.loading", nil)
}

func (m *Media) loadMedia(ctx context.Context, mediaId ...interface{}) (interface{}, error) {
	mediaService := m.app.ApiClient().MediaService()

	if mediaId, ok := mediaId[0].(v1.MediaId); ok {
		return mediaService.Media(ctx, mediaId)
	}

	return nil, errors.New("invalid media id")
}
