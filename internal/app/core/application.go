package core

import (
	"context"
	"log/slog"

	"gioui.org/widget/material"

	"anistats/internal/app/api"
	"anistats/pkg/giorno/async"
	"anistats/pkg/giorno/localizer"
	"anistats/pkg/giorno/router"
)

type Application interface {
	// Run renders the application
	Run(ctx context.Context) error

	// Theme returns the currently applied material.Theme instance
	Theme() *material.Theme

	// GkAsyncScheduler returns the global async.Scheduler
	GkAsyncScheduler() async.Scheduler

	// Router returns the global router.Manager
	Router() router.Manager

	// Localizer returns the current locale's localizer.Localizer instance
	Localizer() localizer.Localizer

	// LocalizerManager returns the core localizer.Manager instance
	LocalizerManager() localizer.Manager

	// Logger returns the global logger instance
	Logger() *slog.Logger

	// ApiClient returns the current api.ClientBundle used to connect to a backend
	ApiClient() api.ClientBundle
}
