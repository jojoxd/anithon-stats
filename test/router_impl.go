package test

import (
	"fmt"

	"anistats/test/intent"
	"anistats/test/route"
	"anistats/test/view"
)

type router struct {
	routes *route.Collection
	stack  Stack
	events chan Event
}

func NewRouter() Router {
	return &router{
		routes: route.NewRouteCollection(),
		stack:  NewSimpleStack(),
		events: make(chan Event, 8),
	}
}

func (router router) Register(r route.Base) error {
	return router.routes.Register(r)
}

func (router router) Push(it intent.Base) error {
	target, err := router.routes.Get(it.Target())
	if err != nil {
		return err
	}

	vw := target.Create()
	target.ApplyIntent(it, vw)
	router.events <- NavigationEvent{
		Type:   NavigationEventPush,
		Intent: it,
		View:   vw,
	}

	router.stack.Push(&StackItem{
		View:   vw,
		Intent: it,
	})

	return nil
}

func (router router) Replace(it intent.Base) error {
	target, err := router.routes.Get(it.Target())
	if err != nil {
		return err
	}

	vw := target.Create()
	target.ApplyIntent(it, vw)
	router.events <- NavigationEvent{
		Type:   NavigationEventReplace,
		Intent: it,
		View:   vw,
	}

	// todo: finishers?
	router.stack.Clear()

	return nil
}

func (router router) Current() view.View {
	item := router.stack.Peek()
	if item == nil {
		return nil
	}

	return item.View
}

func (router router) Back() error {
	current := router.stack.Peek()
	defer router.stack.Pop()

	if current == nil {
		return fmt.Errorf("no current view")
	}

	view.Finish(current.View)
	// todo: resolver stuff

	return nil
}

func (router router) Events() <-chan Event {
	return router.events
}
