package test

import (
	"anistats/test/intent"
	"anistats/test/view"
)

type Stack interface {
	Push(*StackItem)
	Pop() *StackItem

	Peek() *StackItem
	Len() int
	Clear()
}

type StackItem struct {
	View   view.View
	Intent intent.Base
}
