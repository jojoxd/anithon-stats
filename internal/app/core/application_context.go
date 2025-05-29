package core

import (
	"context"
	"errors"
	"fmt"

	"gioui.org/widget/material"
)

var errNoContext = errors.New("no application context found")

func AppFromContext(ctx context.Context) Application {
	if app, ok := ctx.Value(AppContextKey).(Application); ok {
		return app
	}

	panic(errNoContext)
}

func LocalizerFromContext(ctx context.Context) Localizer {
	app := AppFromContext(ctx)

	fmt.Printf("app: %+v l10n: %+v\n", app, app.Localizer())

	return app.Localizer()
}

func ThemeFromContext(ctx context.Context) *material.Theme {
	app := AppFromContext(ctx)

	return app.Theme()
}
