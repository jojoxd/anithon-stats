package test

type MultiStack struct {
	stacks            []*SimpleStack
	currentStackIndex int
}

func NewMultiStack() *MultiStack {
	return &MultiStack{
		stacks:            make([]*SimpleStack, 0),
		currentStackIndex: 0,
	}
}

func (m MultiStack) Push(item *StackItem) {
	if len(m.stacks) == 0 {
		m.stacks = append(m.stacks, NewSimpleStack())
	}

	m.stacks[m.currentStackIndex].Push(item)
}

func (m MultiStack) Pop() *StackItem {
	// TODO implement me
	panic("implement me")
}

func (m MultiStack) Peek() *StackItem {
	// TODO implement me
	panic("implement me")
}

func (m MultiStack) Len() int {
	// TODO implement me
	panic("implement me")
}

func (m MultiStack) Clear() {
	// TODO implement me
	panic("implement me")
}
