package event

import (
	"anistats/pkg/giorno/router2/intent"
	"anistats/pkg/giorno/router2/view"
)

type nilManager struct{}

func NewNilManager() Manager {
	return &nilManager{}
}

func (n nilManager) NavigationEvent(NavigationType, view.View, intent.Base) {}

func (n nilManager) Channel() <-chan Event {
	return nil
}
