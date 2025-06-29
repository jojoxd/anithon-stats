package route

import (
	"anistats/test/intent"
	"anistats/test/internal"
	"anistats/test/view"
)

type Factory func() view.View

type Route struct {
	target  internal.Target
	factory Factory
}

func New(id string, factory Factory) *Route {
	return &Route{
		target:  internal.Target(id),
		factory: factory,
	}
}

func (r Route) Target() internal.Target {
	return r.target
}

func (r Route) Create() view.View {
	return r.factory()
}

func (r Route) Intent() intent.Base {
	return intent.New(r.target)
}

func (r Route) ApplyIntent(it intent.Base, vw view.View) {
	vw.OnIntent(it)
}
