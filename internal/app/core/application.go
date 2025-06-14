package core

import (
	"log/slog"

	"gioui.org/widget/material"

	"anistats/internal/app/api"
	"anistats/pkg/gio_kit/gkasync"
	"anistats/pkg/gio_router"
)

type Application interface {
	// Loop renders the application
	Loop() error

	// Localizer returns the current locale's Localizer instance
	Localizer() Localizer

	// LocalizerManager returns the core LocalizerManager instance
	LocalizerManager() LocalizerManager

	// Theme returns the currently applied material.Theme instance
	Theme() *material.Theme

	// Logger returns the global logger instance
	Logger() *slog.Logger

	ApiClient() api.ClientBundle

	Router() gio_router.Manager

	GkAsyncScheduler() gkasync.Scheduler
}
