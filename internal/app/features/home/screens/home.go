package screens

import (
	"image/color"
	"time"

	"gioui.org/layout"
	"gioui.org/unit"
	"gioui.org/widget/material"
	"git.jojoxd.nl/projects/go-giorno/ext/gmaterial/card"
	"git.jojoxd.nl/projects/go-giorno/ext/gmaterial/sheet"
	"git.jojoxd.nl/projects/go-giorno/router/intent"
	"git.jojoxd.nl/projects/go-giorno/router/view"
	"github.com/google/uuid"

	"anistats/internal/app/core"
	"anistats/internal/app/core/routes"
	"anistats/internal/app/widget/language_switcher"
)

type Home struct {
	app          core.Application
	langSwitcher *language_switcher.Widget
}

func NewHome(app core.Application) view.View {
	return &Home{
		app:          app,
		langSwitcher: language_switcher.New(app.LocalizerManager()),
	}
}

func (h Home) Layout(gtx layout.Context) layout.Dimensions {
	h.langSwitcher.Update(gtx.Source)

	th := h.app.Theme()

	c := card.Style{
		Sheet: sheet.Style{
			Color:        color.NRGBA{},
			Inset:        0,
			BorderRadius: 32,
			BorderColor:  th.Primary(),
			BorderWidth:  0,
		},
		Title:        material.H4(th.Material(), "Test").Layout,
		PrependInner: nil,
		ContentInset: unit.Dp(32),
	}

	return layout.UniformInset(64).Layout(gtx, func(gtx layout.Context) layout.Dimensions {
		return c.Layout(gtx, func(gtx layout.Context) layout.Dimensions {
			return h.langSwitcher.Layout(gtx, th.Material())
		})
	})
}

func (h Home) OnIntent(intent intent.Base) {
	go func() {
		time.Sleep(5 * time.Second)
		h.app.Router().Push(routes.Media.Intent(uuid.MustParse("0197568d-6e5b-7d67-b9d5-d244fec5a766")))
		// h.app.Router().Push(routes.UserOverview.Intent(uuid.UUID(uuid.MustParse("01975666-3cac-7040-8232-46faa1e0723d"))))
	}()
}
