package test

import (
	"anistats/test/intent"
	"anistats/test/view"
)

type Event interface {
	implementsEvent()
}

type NavigationEventType int

const (
	NavigationEventReplace NavigationEventType = iota
	NavigationEventPush
)

type NavigationEvent struct {
	Type   NavigationEventType
	Intent intent.Base
	View   view.View
}

func (e NavigationEvent) implementsEvent() {}
