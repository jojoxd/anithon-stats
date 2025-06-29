package event

import (
	"anistats/pkg/giorno/router2/intent"
	"anistats/pkg/giorno/router2/view"
)

type managerImpl struct {
	ch chan Event
}

func NewManager(buffer int) Manager {
	return &managerImpl{
		ch: make(chan Event, buffer),
	}
}

func (m *managerImpl) NavigationEvent(typ NavigationType, vw view.View, it intent.Base) {
	m.ch <- &NavigationEvent{
		Type:   typ,
		Intent: it,
		View:   vw,
	}
}

func (m *managerImpl) Channel() <-chan Event {
	return m.ch
}
