package page

import (
	"gioui.org/layout"
	"gioui.org/widget/material"

	"anistats/internal/app/core"
	"anistats/pkg/gio_router"
)

var Overview = gio_router.NewRoute(renderOverview)

func renderOverview(ctx gio_router.Context[core.AppContext], params any) layout.Dimensions {
	title := material.H1(ctx.App().MaterialTheme(), "Media Overview")

	return title.Layout(ctx.Context)
}
