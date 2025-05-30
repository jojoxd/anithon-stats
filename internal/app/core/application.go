package core

import (
	"log/slog"

	"gioui.org/widget/material"
)

const AppContextKey = "app"

type Application interface {
	Loop() error
	Localizer() Localizer
	Theme() *material.Theme
	Logger() *slog.Logger
}
