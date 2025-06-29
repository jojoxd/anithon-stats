package screens

import (
	"context"
	"time"

	"gioui.org/layout"
	"github.com/google/uuid"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/internal/app/core/route"
	"anistats/internal/app/widget/language_switcher"
	"anistats/pkg/giorno/router"
)

type Home struct {
	router.BaseScreen
	app          core.Application
	langSwitcher *language_switcher.Widget
}

func NewHome(app core.Application) router.RouteView {
	langSwitcher := language_switcher.New(app.LocalizerManager())

	return &Home{
		app:          app,
		langSwitcher: langSwitcher,
	}
}

func (h *Home) Layout(gtx layout.Context) layout.Dimensions {
	h.langSwitcher.Update(gtx.Source)

	theme := h.app.Theme()
	return h.langSwitcher.Layout(gtx, theme)
}

func (h *Home) OnIntent(intent router.Intent) error {
	err := h.BaseScreen.OnIntent(intent)
	if err != nil {
		return err
	}

	go func() {
		time.Sleep(5 * time.Second)

		err = h.app.Router().RequestSwitch(route.Media(v1.MediaId(uuid.MustParse("0197568d-6e5b-7d67-b9d5-d244fec5a766"))))
		if err != nil {
			panic(err)
		}
	}()

	return nil
}

func (h *Home) Id() router.Route {
	return route.HomeRoute
}

func (h *Home) Title(_ context.Context) string {
	localizer := h.app.Localizer()

	return localizer.T("page.home.title")
}
