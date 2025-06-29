package event

import (
	"anistats/pkg/giorno/router2/intent"
	"anistats/pkg/giorno/router2/view"
)

type Manager interface {
	NavigationEvent(NavigationType, view.View, intent.Base)
	Channel() <-chan Event
}
