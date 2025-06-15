package main

import (
	"gioui.org/layout"

	"anistats/pkg/gio_kit/example/base"
)

func main() {
	ex := example{}
	base.Run(ex.frame)
}

type example struct{}

func (e example) frame(gtx layout.Context) {

}
