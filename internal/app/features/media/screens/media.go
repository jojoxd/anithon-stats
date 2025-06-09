package screens

import (
	"context"
	"errors"
	"fmt"

	"gioui.org/layout"
	"gioui.org/widget/material"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	widget2 "anistats/internal/app/features/media/widget"
	"anistats/internal/app/widget"
	"anistats/pkg/gio_router"
)

var MediaId = gio_router.NewRoute("media.media")

type Media struct {
	location gio_router.RouteLocation
	loader   widget.AsyncLoader[v1.Media, v1.MediaId]
	v1.MediaId
}

type MediaParams struct {
	MediaId v1.MediaId
}

func NewMedia() gio_router.RouteView {
	m := &Media{}

	m.loader = widget.NewAsyncLoader(widget.AsyncLoaderConfig[v1.Media, v1.MediaId]{
		Load:    loadMedia,
		Loading: m.layoutLoading,
		Loaded:  m.layoutLoaded,
	})

	return m
}

func (m *Media) Layout(ctx context.Context) layout.Dimensions {
	l := core.LoggerFromContext(ctx)
	l.Debug("render media screen")

	msvc := core.ApiClientFromContext(ctx).MediaService()

	media, _ := msvc.Media(m.MediaId)
	return m.layoutLoaded(ctx, &media)

	// return m.loader.Layout(ctx)
}

func (m *Media) layoutLoading(ctx context.Context) layout.Dimensions {
	gtx := gio_router.GtxFromContext(ctx)
	theme := core.ThemeFromContext(ctx)

	return material.H1(theme, "Loading").Layout(gtx)
}

func (m *Media) layoutLoaded(ctx context.Context, media *v1.Media) layout.Dimensions {
	// gtx := gio_router.GtxFromContext(ctx)
	// theme := core.ThemeFromContext(ctx)
	// localizer := core.LocalizerFromContext(ctx)
	//
	// return material.H1(theme, localizer.TTv1(media.DisplayName())).Layout(gtx)

	return widget2.MediaCard(media).Layout(ctx)
}

func (m *Media) OnIntent(intent gio_router.Intent) error {
	fmt.Printf("Media.OnIntent: %+v\n", intent)
	if params, ok := intent.Params.(MediaParams); ok {
		m.location = intent.Location()
		// m.loader.Load(params.MediaId)

		m.MediaId = params.MediaId

		return nil
	}

	return errors.New(fmt.Sprintf("invalid intent: expected MediaParams, got %T %+v", intent.Params, intent.Params))
}

func (m *Media) Id() gio_router.Route {
	return MediaId
}

func (m *Media) Location() gio_router.RouteLocation {
	return m.location
}

func (m *Media) Title(ctx context.Context) string {
	localizer := core.LocalizerFromContext(ctx)

	media := m.loader.Data()
	if media != nil {
		return localizer.PageTitle("page.media.media.title", map[string]string{
			"Name": localizer.TTv1(media.DisplayName),
		})
	}

	return localizer.PageTitle("page.media.media.loading", nil)
}

func loadMedia(mediaId v1.MediaId) (*v1.Media, error) {
	// ms, err := api.NewMediaService(viper.GetViper().Sub("app.client"))
	// if err != nil {
	// 	return nil, err
	// }
	//
	// time.Sleep(2 * time.Second)
	//
	// m, err := ms.Media(mediaId)
	// return &m, err

	return nil, errors.New("AAAAA")
}
