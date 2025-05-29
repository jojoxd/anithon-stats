package core

import (
	gioApp "gioui.org/app"
	gioMaterial "gioui.org/widget/material"
	"golang.org/x/text/language"

	"anistats/internal/config"
	"anistats/pkg/gio_router"
)

type AppContext interface {
	MaterialTheme() *gioMaterial.Theme
	Router() *gio_router.Router[AppContext]
	Config() *config.App
	Window() *gioApp.Window

	BreakPoints() Breakpoints
	I18n() Localizer
	MediaLocalizer() MediaLocalizer
	SetLocale(lang language.Tag) error
}
