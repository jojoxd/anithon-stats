package gio_router

import (
	"errors"
	"fmt"
	"log"
	"net/url"
	"slices"
	"sync"

	"gioui.org/app"
)

var _ Manager = (*defaultManager)(nil)

type defaultManager struct {
	window         *app.Window
	stacks         []*ViewStack
	currentTabIdx  int
	routeProviders map[Route]RouteProvider
	// title of the window
	currentTitle  string
	dispatchMutex sync.Mutex
}

func (vm *defaultManager) CurrentView() RouteView {
	if len(vm.stacks) <= 0 {
		return nil
	}

	stack := vm.stacks[vm.currentTabIdx]
	vw := stack.Peek()

	t, ok := vw.(RouteViewTitler)
	if ok && vm.currentTitle != t.Title() {
		vm.currentTitle = t.Title()
		vm.window.Option(app.Title(vm.currentTitle))
	}

	return vw
}

func (vm *defaultManager) CurrentViewIndex() int {
	return vm.currentTabIdx
}

func (vm *defaultManager) Register(Id Route, provider RouteProvider) error {
	vm.dispatchMutex.Lock()
	defer vm.dispatchMutex.Unlock()

	if Id == NilRoute {
		return errors.New("cannot register empty view Id")
	}

	if provider == nil {
		return errors.New("view provider is nil")
	}

	if vm.routeProviders == nil {
		vm.routeProviders = make(map[Route]RouteProvider)
	}

	vm.routeProviders[Id] = provider
	log.Println("registered view: ", Id)
	return nil
}

func (vm *defaultManager) NavBack() RouteView {
	if len(vm.stacks) <= 0 {
		return nil
	}

	stack := vm.stacks[vm.currentTabIdx]
	if stack.Depth() <= 1 {
		// keep the last view
		return stack.Peek()
	}

	vw := stack.Pop()
	finishRouteView(vw)

	return stack.Peek()
}

func (vm *defaultManager) HasPrev() bool {
	if len(vm.stacks) <= 0 {
		return false
	}
	stack := vm.stacks[vm.currentTabIdx]
	return stack.Depth() > 1
}

func (vm *defaultManager) RequestSwitch(intent Intent) error {
	// use mutex to guard the dispatching
	vm.dispatchMutex.Lock()
	defer vm.dispatchMutex.Unlock()

	// Even if using an empty intent, vm refreshes the window.
	defer vm.window.Invalidate()

	if intent.Target == (Route{}) {
		return nil
	}
	provider, ok := vm.routeProviders[intent.Target]
	if !ok {
		return fmt.Errorf("no target view found: %v", intent.Target)
	}

	var targetView RouteView
	stack := vm.route(&intent)

	// get target view
	if topVw := stack.Peek(); topVw != nil && topVw.Location() == intent.Location() {
		targetView = topVw
	} else {
		targetView = provider()
		err := stack.Push(targetView)
		if err != nil {
			return fmt.Errorf("push to viewstack error: %w", err)
		}
	}

	err := targetView.OnIntent(intent)
	if err != nil {
		stack.Pop()
		return fmt.Errorf("error handling intent: %w", err)
	}

	location := intent.Location()
	log.Printf("switching to %s", location.String())
	return nil
}

// routeView routes the intent to the proper viewstack/tab by intent.URL()
func (vm *defaultManager) routeView(intent *Intent) *ViewStack {
	if len(vm.stacks) <= vm.currentTabIdx {
		// try to fix the illegal state
		stack := NewViewStack()
		vm.stacks = append(vm.stacks, stack)
		vm.currentTabIdx = len(vm.stacks) - 1
		return stack
	}

	// Iterate through all the viewstacks to find the top view with the same location.
	// switch to and replace the existing view.
	for idx, s := range vm.stacks {
		if s.Peek().Location() == intent.Location() {
			// switch to the tab
			vm.currentTabIdx = idx
			return s
		}
	}

	if intent.RequireNew {
		stack := NewViewStack()
		vm.stacks = append(vm.stacks, stack)
		vm.currentTabIdx = len(vm.stacks) - 1
		return stack
	}

	// Respect referer by checking its parent view.
	if intent.Referer != (url.URL{}) && intent.Referer == vm.CurrentView().Location() {
		// push to current view stack
		return vm.stacks[vm.currentTabIdx]
	}

	// then try to match the viewID:
	for idx, s := range vm.stacks {
		if intent.Target == s.Peek().Id() {
			vm.currentTabIdx = idx
			return s
		}
	}

	// create new stack
	stack := NewViewStack()
	vm.stacks = append(vm.stacks, stack)
	vm.currentTabIdx = len(vm.stacks) - 1

	return stack
}

// route the intent to the proper viewstack/tab
func (vm *defaultManager) route(intent *Intent) *ViewStack {
	return vm.routeView(intent)
}

func (vm *defaultManager) OpenedViews() []RouteView {
	views := make([]RouteView, len(vm.stacks))
	for idx, stack := range vm.stacks {
		views[idx] = stack.Peek()
	}

	return views
}

func (vm *defaultManager) CloseTab(idx int) {
	if idx < 0 || idx >= len(vm.stacks) {
		return
	}

	stack := vm.stacks[idx]
	stack.Clear()
	vm.stacks = slices.Delete[[]*ViewStack, *ViewStack](vm.stacks, idx, idx+1)
	if vm.currentTabIdx >= idx && vm.currentTabIdx > 0 {
		vm.currentTabIdx -= 1
	}
}

func (vm *defaultManager) SwitchTab(idx int) {
	if idx >= len(vm.stacks) || idx < 0 {
		return
	}

	vm.currentTabIdx = idx
}

func (vm *defaultManager) Invalidate() {
	vm.window.Invalidate()
}

func (vm *defaultManager) Reset() {
	for _, stack := range vm.stacks {
		stack.Clear()
	}

	vm.currentTabIdx = 0
	vm.stacks = vm.stacks[:0]
	vm.Invalidate()
}

func NewManager(window *app.Window) Manager {
	return &defaultManager{window: window}
}
