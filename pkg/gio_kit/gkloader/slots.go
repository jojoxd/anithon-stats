package gkloader

import (
	"errors"
	"fmt"

	"gioui.org/layout"
)

type Slots[TData any] struct {
	Initial func(gtx layout.Context) layout.Dimensions
	Error   func(gtx layout.Context, err error) layout.Dimensions
	Queued  func(gtx layout.Context) layout.Dimensions
	Loading func(gtx layout.Context) layout.Dimensions
	Loaded  func(gtx layout.Context, data TData) layout.Dimensions
}

func (slots Slots[TData]) Layout(gtx layout.Context, state State) layout.Dimensions {
	fmt.Printf("slots.go: gkloader.Slots Layout called with state = %#v\n", state)

	switch state := state.(type) {
	case *ErrorState:
		return slots.layoutError(gtx, state.Error)

	case *InitialState:
		return slots.layoutInitial(gtx)

	case *QueuedState:
		return slots.layoutQueued(gtx)

	case *LoadingState:
		return slots.layoutLoading(gtx)

	case *LoadedState:
		return slots.layoutLoaded(gtx, state)
	}

	return layout.Dimensions{}
}

func (slots Slots[TData]) layoutError(gtx layout.Context, err error) layout.Dimensions {
	if slots.Error == nil {
		// TODO should not panic
		panic(err)
	}

	return slots.Error(gtx, err)
}

func (slots Slots[TData]) layoutInitial(gtx layout.Context) layout.Dimensions {
	if slots.Initial == nil {
		return layout.Dimensions{}
	}

	return slots.Initial(gtx)
}

func (slots Slots[TData]) layoutQueued(gtx layout.Context) layout.Dimensions {
	if slots.Queued == nil {
		return slots.layoutLoading(gtx)
	}

	return slots.Queued(gtx)
}

func (slots Slots[TData]) layoutLoading(gtx layout.Context) layout.Dimensions {
	if slots.Loading == nil {
		return slots.layoutInitial(gtx)
	}

	return slots.Loading(gtx)
}

func (slots Slots[TData]) layoutLoaded(gtx layout.Context, state *LoadedState) layout.Dimensions {
	if slots.Loaded == nil {
		return slots.layoutError(gtx, errors.New("no loaded slot defined"))
	}

	if data, ok := state.Data.(TData); ok {
		return slots.Loaded(gtx, data)
	}

	return slots.layoutError(gtx, errors.New("failed to cast data"))
}
