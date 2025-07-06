package core

import (
	"context"
	"log/slog"

	"gioui.org/widget/material"

	"git.jojoxd.nl/projects/go-giorno/async"
	"git.jojoxd.nl/projects/go-giorno/localizer"
	"git.jojoxd.nl/projects/go-giorno/router"

	"anistats/internal/app/api"
)

type Application interface {
	// Run renders the application
	Run(ctx context.Context) error

	// Theme returns the currently applied material.Theme instance
	Theme() *material.Theme

	// GkAsyncScheduler returns the global async.Scheduler
	GkAsyncScheduler() async.Scheduler

	// Router returns the global router.Router
	Router() router.Router

	// Localizer returns the current locale's localizer.Localizer instance
	Localizer() localizer.Localizer

	// LocalizerManager returns the core localizer.Manager instance
	LocalizerManager() localizer.Manager

	// Logger returns the global logger instance
	Logger() *slog.Logger

	// ApiClient returns the current api.ClientBundle used to connect to a backend
	ApiClient() api.ClientBundle
}
