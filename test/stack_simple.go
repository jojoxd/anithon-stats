package test

import "sync"

type SimpleStack struct {
	items []*StackItem
	mu    sync.RWMutex
}

func NewSimpleStack() *SimpleStack {
	return &SimpleStack{
		items: make([]*StackItem, 0),
	}
}

func (s *SimpleStack) Push(item *StackItem) {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.items = append(s.items, item)
}

func (s *SimpleStack) Pop() *StackItem {
	s.mu.Lock()
	defer s.mu.Unlock()

	if len(s.items) == 0 {
		return nil
	}

	item := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]

	return item
}

func (s *SimpleStack) Peek() *StackItem {
	s.mu.RLock()
	defer s.mu.RUnlock()

	return s.items[len(s.items)-1]
}

func (s *SimpleStack) Len() int {
	s.mu.RLock()
	defer s.mu.RUnlock()

	return len(s.items)
}

func (s *SimpleStack) Clear() {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.items = make([]*StackItem, 0)
}
