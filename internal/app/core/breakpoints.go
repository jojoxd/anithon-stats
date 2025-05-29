package core

type Breakpoint int

const (
	BreakpointMobile       Breakpoint = 800
	BreakpointDesktop      Breakpoint = 1200
	BreakpointDesktopLarge Breakpoint = 1600
)

type Breakpoints interface {
	Gt(bp Breakpoint) bool
	Lt(bp Breakpoint) bool
	Current() Breakpoint
}
