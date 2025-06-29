package router2

import (
	"anistats/pkg/giorno/router2/event"
	"anistats/pkg/giorno/router2/intent"
	"anistats/pkg/giorno/router2/route"
	"anistats/pkg/giorno/router2/view"
)

type Router interface {
	// Register registers a route.Route
	Register(route.Base) error

	// Push pushes an Intent onto the current stack
	Push(it intent.Base) error

	Back() error
	Current() view.View

	// Replace replaces the current stack with an Intent
	Replace(it intent.Base) error

	Events() <-chan event.Event
}
