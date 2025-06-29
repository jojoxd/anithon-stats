package view

import (
	"gioui.org/layout"

	"anistats/test/intent"
)

type View interface {
	Layout(gtx layout.Context) layout.Dimensions
	OnIntent(intent intent.Base)
}
