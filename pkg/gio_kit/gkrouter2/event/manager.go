package event

import (
	"anistats/pkg/gio_kit/gkrouter2/intent"
	"anistats/pkg/gio_kit/gkrouter2/view"
)

type Manager interface {
	NavigationEvent(NavigationType, view.View, intent.Base)
	Channel() <-chan Event
}
