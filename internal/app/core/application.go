package core

import (
	"context"
	"log/slog"

	"gioui.org/widget/material"

	"anistats/internal/app/api"
)

type Application interface {
	// Loop renders the application
	Loop(ctx context.Context) error

	// Localizer returns the current locale's Localizer instance
	Localizer() Localizer

	// LocalizerManager returns the core LocalizerManager instance
	LocalizerManager() LocalizerManager

	// Theme returns the currently applied material.Theme instance
	Theme() *material.Theme

	// Logger returns the global logger instance
	Logger() *slog.Logger

	RuntimeConfig() RuntimeConfig
	ApiClient() api.ClientBundle
}
