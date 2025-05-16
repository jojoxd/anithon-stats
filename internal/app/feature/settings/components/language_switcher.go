package components

import (
	"gioui.org/layout"
	"gioui.org/widget"
	"gioui.org/widget/material"

	"anistats/internal/app/core"
	"anistats/internal/app/res"
	"anistats/pkg/gio_router"
)

type LanguageSwitcher struct {
	currentIndex int
	button       *widget.Clickable
}

func NewLanguageSwitcher() *LanguageSwitcher {
	return &LanguageSwitcher{
		currentIndex: 0,
		button:       &widget.Clickable{},
	}
}

func (ls *LanguageSwitcher) Layout(ctx gio_router.Context[core.AppContext]) layout.Dimensions {
	theme := ctx.App().MaterialTheme()

	if ls.button.Clicked(ctx.Context) {
		ls.currentIndex = (ls.currentIndex + 1) % len(res.AppLanguages)
		err := ctx.App().SetLocale(res.AppLanguages[ls.currentIndex])
		if err != nil {
			panic(err)
		}
	}

	btn := material.Button(theme, ls.button, "Switch Language")

	return btn.Layout(ctx.Context)
}
