package core_impl

import (
	"image"

	"anistats/internal/app/core"
)

type breakpoints struct {
	size image.Point
}

func newBreakpoints() *breakpoints {
	return &breakpoints{size: image.Point{X: 0, Y: 0}}
}

func (b *breakpoints) update(point image.Point) {
	b.size = point
}

func (b *breakpoints) Gt(bp core.Breakpoint) bool {
	return b.size.X > int(bp)
}

func (b *breakpoints) Lt(bp core.Breakpoint) bool {
	return b.size.X <= int(bp)
}

func (b *breakpoints) Current() core.Breakpoint {
	// TODO implement me
	panic("implement me")
}
