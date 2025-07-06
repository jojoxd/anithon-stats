package screens

import (
	"gioui.org/layout"
	"gioui.org/widget/material"
	"git.jojoxd.nl/projects/go-giorno/loader"
	"git.jojoxd.nl/projects/go-giorno/router/intent"
	"git.jojoxd.nl/projects/go-giorno/router/view"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/internal/app/features/media/provider"
	"anistats/internal/app/features/media/widget"
)

type Media struct {
	app       core.Application
	mediaCard *widget.CardStyle
	provider  *provider.Media
	mediaId   v1.MediaId
}

func NewMedia(app core.Application) view.TypedView[v1.MediaId] {
	return &Media{
		app:       app,
		mediaCard: widget.Card(app),
		provider:  provider.NewMedia(app),
		mediaId:   v1.MediaId{},
	}
}

func (m *Media) Layout(gtx layout.Context) layout.Dimensions {
	theme := m.app.Theme()

	return m.provider.Layout(gtx, m.mediaId, loader.Slots[v1.Media]{
		Loading: func(gtx layout.Context) layout.Dimensions {
			return material.Loader(theme).Layout(gtx)
		},
		Loaded: func(gtx layout.Context, media v1.Media) layout.Dimensions {
			return m.mediaCard.Layout(gtx, theme, media)
		},
	}.Layout)
}

func (m *Media) OnIntent(intent intent.Base) {}

func (m *Media) OnParameter(mediaId v1.MediaId) {
	m.mediaId = mediaId
}
