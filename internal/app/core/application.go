package core

import (
	"context"
	"log/slog"

	"gioui.org/widget/material"

	"anistats/internal/app/api"
	"anistats/pkg/gio_kit/gkasync"
	"anistats/pkg/gio_kit/gklocalizer"
	"anistats/pkg/gio_kit/gkrouter"
)

type Application interface {
	// Run renders the application
	Run(ctx context.Context) error

	// Theme returns the currently applied material.Theme instance
	Theme() *material.Theme

	// GkAsyncScheduler returns the global gkasync.Scheduler
	GkAsyncScheduler() gkasync.Scheduler

	// Router returns the global gkrouter.Manager
	Router() gkrouter.Manager

	// Localizer returns the current locale's gklocalizer.Localizer instance
	Localizer() gklocalizer.Localizer

	// LocalizerManager returns the core gklocalizer.Manager instance
	LocalizerManager() gklocalizer.Manager

	// Logger returns the global logger instance
	Logger() *slog.Logger

	// ApiClient returns the current api.ClientBundle used to connect to a backend
	ApiClient() api.ClientBundle
}
