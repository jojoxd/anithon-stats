package screens

import (
	"context"
	"errors"
	"fmt"
	"image"
	"net/http"
	"time"

	"gioui.org/layout"
	"gioui.org/widget/material"
	"golang.org/x/text/language"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/internal/app/core/widget"
	widget2 "anistats/internal/app/features/media/widget"
	"anistats/internal/app/res"
	"anistats/pkg/gio_router"
)

var MediaId = gio_router.NewRoute("media.media")

type Media struct {
	location gio_router.RouteLocation
	loader   widget.AsyncLoader[v1.Media, v1.MediaId]
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

	return m.loader.Layout(ctx)
}

func (m *Media) layoutLoading(ctx context.Context) layout.Dimensions {
	gtx := gio_router.GtxFromContext(ctx)
	theme := core.ThemeFromContext(ctx)

	return material.H1(theme, "Loading").Layout(gtx)
}

func (m *Media) layoutLoaded(ctx context.Context, media v1.Media) layout.Dimensions {
	// gtx := gio_router.GtxFromContext(ctx)
	// theme := core.ThemeFromContext(ctx)
	// localizer := core.LocalizerFromContext(ctx)
	//
	// return material.H1(theme, localizer.TTv1(media.GetDisplayName())).Layout(gtx)

	return widget2.MediaCard(m.loader.Data()).Layout(ctx)
}

func (m *Media) OnIntent(intent gio_router.Intent) error {
	fmt.Printf("Media.OnIntent: %+v\n", intent)
	if params, ok := intent.Params.(MediaParams); ok {
		m.location = intent.Location()
		m.loader.Load(params.MediaId)

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
			"Name": localizer.TTv1(media.GetDisplayName()),
		})

	}

	return localizer.PageTitle("page.media.media.loading", nil)
}

type Test struct {
	Id             v1.MediaId
	cachedCoverArt image.Image
}

func (t Test) GetId() v1.MediaId {
	return t.Id
}

func (t Test) GetDisplayName() v1.Translatable {
	return TestT{}
}

func (t Test) CoverArt() image.Image {
	if t.cachedCoverArt != nil {
		return t.cachedCoverArt
	}

	resp, err := http.Get("https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx185939-hqt1He153el8.jpg")
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()

	img, _, err := image.Decode(resp.Body)
	if err != nil {
		panic(err)
	}

	t.cachedCoverArt = img
	return t.cachedCoverArt
}

type TestT struct{}

func (t TestT) ForLanguage(lang language.Tag) string {
	switch lang {
	case res.LangJapaneseHepburn:
		return "Hibi wa Sugiredo Meshi Umashi"
	case res.LangJapanese:
		return "日々は過ぎれど飯うまし"
	}

	return "Food for the Soul"
}

func loadMedia(mediaId v1.MediaId) (v1.Media, error) {
	time.Sleep(2 * time.Second)

	return Test{Id: mediaId}, nil
}
