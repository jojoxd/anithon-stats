package core

import (
	"context"
	"errors"
	"log/slog"

	"gioui.org/widget/material"

	"anistats/internal/app/api"
)

var errNoContext = errors.New("no application context found")

const AppContextKey = "app"

func NewAppContext(ctx context.Context, app Application) context.Context {
	return context.WithValue(ctx, AppContextKey, app)
}

func AppFromContext(ctx context.Context) Application {
	if app, ok := ctx.Value(AppContextKey).(Application); ok {
		return app
	}

	panic(errNoContext)
}

func LocalizerFromContext(ctx context.Context) Localizer {
	app := AppFromContext(ctx)

	return app.Localizer()
}

func ThemeFromContext(ctx context.Context) *material.Theme {
	app := AppFromContext(ctx)

	return app.Theme()
}

func LoggerFromContext(ctx context.Context) *slog.Logger {
	app := AppFromContext(ctx)

	return app.Logger()
}

func ApiClientFromContext(ctx context.Context) api.ClientBundle {
	app := AppFromContext(ctx)

	return app.ApiClient()
}
