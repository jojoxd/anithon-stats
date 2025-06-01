package core

import (
	"log/slog"

	"gioui.org/widget/material"
)

const AppContextKey = "app"

type Application interface {
	Loop() error
	// Localizer returns the current locale's Localizer instance
	Localizer() Localizer
	// LocalizerManager returns the core LocalizerManager instance
	LocalizerManager() LocalizerManager
	Theme() *material.Theme
	Logger() *slog.Logger
}
