package event

import (
	"anistats/pkg/giorno/router2/intent"
	"anistats/pkg/giorno/router2/view"
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
