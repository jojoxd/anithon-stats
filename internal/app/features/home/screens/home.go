package screens

import (
	"time"

	"gioui.org/layout"
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

	theme := h.app.Theme()
	return h.langSwitcher.Layout(gtx, theme)
}

func (h Home) OnIntent(intent intent.Base) {
	go func() {
		time.Sleep(5 * time.Second)
		h.app.Router().Push(routes.Media.Intent(uuid.MustParse("0197568d-6e5b-7d67-b9d5-d244fec5a766")))
		// h.app.Router().Push(routes.UserOverview.Intent(uuid.UUID(uuid.MustParse("01975666-3cac-7040-8232-46faa1e0723d"))))
	}()
}
