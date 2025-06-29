package event

import (
	"anistats/pkg/gio_kit/gkrouter2/intent"
	"anistats/pkg/gio_kit/gkrouter2/view"
)

type NavigationType int

const (
	NavigationReplace NavigationType = iota
	NavigationPush
)

type NavigationEvent struct {
	Type   NavigationType
	Intent intent.Base
	View   view.View
}

func (NavigationEvent) implementsEvent() {}
