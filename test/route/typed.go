package route

import (
	"anistats/test/intent"
	"anistats/test/internal"
	"anistats/test/view"
)

type TypedFactory[P any] func() view.TypedView[P]

type TypedRoute[P any] struct {
	target  internal.Target
	factory TypedFactory[P]
}

func NewTyped[P any](id string, factory TypedFactory[P]) TypedRoute[P] {
	return TypedRoute[P]{
		target:  internal.Target(id),
		factory: factory,
	}
}

func (r TypedRoute[P]) Target() internal.Target {
	return r.target
}

func (r TypedRoute[P]) Create() view.View {
	return r.factory()
}

func (r TypedRoute[P]) Intent(param P) intent.Base {
	return intent.NewTyped[P](r.target, param)
}

func (r TypedRoute[P]) ApplyIntent(it intent.Base, vw view.View) {
	vw.OnIntent(it)

	// todo: maybe not panic?
	if it, ok := it.(intent.TypedIntent[P]); ok {
		if vw, ok := vw.(view.TypedView[P]); ok {
			vw.OnParameter(it.Param)
		} else {
			panic("failed to cast view")
		}
	} else {
		panic("failed to cast intent")
	}
}
