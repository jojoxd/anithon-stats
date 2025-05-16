package page

import (
	"fmt"

	"gioui.org/layout"
	"gioui.org/widget/material"
	"golang.org/x/text/language"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/internal/app/feature/settings/components"
	"anistats/pkg/gio_router"
)

var Bootstrap = gio_router.NewRoute(renderBootstrap)

var ls = components.NewLanguageSwitcher()

func renderBootstrap(ctx gio_router.Context[core.AppContext], _ any) layout.Dimensions {
	theme := ctx.App().MaterialTheme()
	i18n := ctx.App().I18n()
	mediaLocalizer := ctx.App().MediaLocalizer()

	media := &Media{}

	title1 := material.H1(theme, i18n.T("bootstrap.title"))
	title2 := material.H1(theme, mediaLocalizer.T(media.GetDisplayName()))

	return layout.Flex{Axis: layout.Vertical}.Layout(ctx.Context,

		layout.Flexed(1, title1.Layout),
		layout.Flexed(1, title2.Layout),

		layout.Flexed(4, func(_ layout.Context) layout.Dimensions {
			return ls.Layout(ctx)
		}),
	)
}

type Media struct{}

func (m Media) GetId() v1.MediaId {
	return v1.MediaId("1")
}

func (m Media) GetDisplayName() v1.Translatable {
	return Translatable{id: m.GetId()}
}

type Translatable struct {
	id v1.MediaId
}

func (t Translatable) ForLanguage(lang language.Tag) string {
	return fmt.Sprintf("Media{%s}.DisplayName{%s}", t.id, lang.String())
}
