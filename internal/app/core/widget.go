package core

import "gioui.org/layout"

type Widget func(gtx layout.Context, app AppContext) layout.Dimensions
