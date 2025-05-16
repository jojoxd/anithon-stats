package page

import (
	"fmt"

	"gioui.org/layout"
	"gioui.org/widget/material"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/pkg/gio_router"
)

var Media = gio_router.NewRoute(renderMedia)

func renderMedia(ctx gio_router.Context[core.AppContext], mediaId v1.MediaId) layout.Dimensions {
	title := material.H1(ctx.App().MaterialTheme(), fmt.Sprintf("Media %s", mediaId))

	return title.Layout(ctx.Context)
}
