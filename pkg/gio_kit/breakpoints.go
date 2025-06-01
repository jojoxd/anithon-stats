package gio_kit

import "gioui.org/unit"

type Breakpoint unit.Dp

func (bp Breakpoint) Gt(other Breakpoint) bool {
	return bp > other
}

func (bp Breakpoint) Lt(other Breakpoint) bool {
	return bp < other
}

func (bp Breakpoint) Gte(other Breakpoint) bool {
	return !bp.Lt(other)
}

func (bp Breakpoint) Lte(other Breakpoint) bool {
	return !bp.Gt(other)
}
