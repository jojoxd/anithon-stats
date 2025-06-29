package view

import (
	"gioui.org/layout"

	"anistats/pkg/gio_kit/gkrouter2/intent"
)

type View interface {
	Layout(gtx layout.Context) layout.Dimensions
	OnIntent(intent intent.Base)
}
