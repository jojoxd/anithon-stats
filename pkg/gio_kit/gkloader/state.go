package gkloader

type StateKind int

const (
	StateKindInitial StateKind = iota
	StateKindError
	StateKindQueued
	StateKindLoading
	StateKindLoaded
)

type State interface {
	Kind() StateKind
}

type ErrorState struct {
	Error error
}

func (s ErrorState) Kind() StateKind {
	return StateKindError
}

type InitialState struct{}

func (s InitialState) Kind() StateKind {
	return StateKindInitial
}

type LoadingState struct{}

func (s LoadingState) Kind() StateKind {
	return StateKindLoading
}

type LoadedState struct {
	Data interface{}
}

func (s LoadedState) Kind() StateKind {
	return StateKindLoaded
}

type QueuedState struct{}

func (s QueuedState) Kind() StateKind {
	return StateKindQueued
}
