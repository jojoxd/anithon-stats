package event

import (
	"anistats/pkg/gio_kit/gkrouter2/intent"
	"anistats/pkg/gio_kit/gkrouter2/view"
)

type nilManager struct{}

func NewNilManager() Manager {
	return &nilManager{}
}

func (n nilManager) NavigationEvent(NavigationType, view.View, intent.Base) {}

func (n nilManager) Channel() <-chan Event {
	return nil
}
