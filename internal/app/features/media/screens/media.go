package screens

import (
	"context"
	"errors"
	"fmt"
	"net/url"
	"time"

	"gioui.org/layout"
	"gioui.org/widget/material"
	"github.com/oligo/gioview/theme"
	"golang.org/x/text/language"

	v1 "anistats/api/v1"
	"anistats/internal/app/core/widget"
	"anistats/pkg/gio_router"
)

var MediaId = gio_router.NewRoute("media.media")

type Media struct {
	loader widget.AsyncLoader[v1.Media, v1.MediaId]
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

func (m *Media) Layout(ctx context.Context, th *theme.Theme) layout.Dimensions {
	gtx := gio_router.GtxFromContext(ctx)

	return m.loader.Layout(gtx, th)
}

func (m *Media) layoutLoading(gtx layout.Context, th *theme.Theme) layout.Dimensions {
	return material.H1(th.Theme, "Loading").Layout(gtx)
}

func (m *Media) layoutLoaded(gtx layout.Context, th *theme.Theme, media v1.Media) layout.Dimensions {
	return material.H1(th.Theme, fmt.Sprintf("Media %+v", media)).Layout(gtx)
}

func (m *Media) OnIntent(intent gio_router.Intent) error {
	mediaId, ok := intent.Params["mediaId"].(v1.MediaId)
	if !ok {
		return errors.New("mediaId is required")
	}

	m.loader.Load(mediaId)

	return nil
}

func (m *Media) Id() gio_router.Route {
	return MediaId
}

func (m *Media) Location() url.URL {
	// TODO implement me
	panic("implement me")
}

func (m *Media) Title() string {
	return fmt.Sprintf("Media")
}

type Test struct {
	Id v1.MediaId
}

func (t Test) GetId() v1.MediaId {
	return t.Id
}

func (t Test) GetDisplayName() v1.Translatable {
	return TestT{}
}

type TestT struct{}

func (t TestT) ForLanguage(lang language.Tag) string {
	return "Media"
}

func loadMedia(mediaId v1.MediaId) (v1.Media, error) {
	time.Sleep(2 * time.Second)

	return Test{Id: mediaId}, nil
}
