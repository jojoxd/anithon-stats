package gio_router

import (
	"errors"

	"gioui.org/layout"
)

type Widget[P any, App any] func(gtx Context[App], params P) layout.Dimensions

type Router[App any] struct {
	stack  []RouteTarget[App]
	app    App
	logger Logger
}

func NewRouter[App any](app App, logger Logger) *Router[App] {
	return &Router[App]{
		stack:  make([]RouteTarget[App], 0),
		app:    app,
		logger: logger,
	}
}

func (r *Router[App]) Push(target RouteTarget[App]) {
	r.logger.Debug("gio_router: pushing", "target", target)

	r.stack = append(r.stack, target)
}

func (r *Router[App]) PopMany(count int) error {
	r.logger.Debug("gio_router: popping", "count", count, "total", len(r.stack))

	// sanity check
	if count > len(r.stack) {
		return errors.New("tried to pop too many items from stack")
	}

	r.stack = r.stack[:count]

	return nil
}

func (r *Router[App]) Pop() error {
	return r.PopMany(1)
}

func (r *Router[App]) Replace(t RouteTarget[App]) {
	r.logger.Debug("gio_router: replacing stack", "target", t)

	r.stack = []RouteTarget[App]{t}
}

func (r *Router[App]) Logger() Logger {
	return r.logger
}
