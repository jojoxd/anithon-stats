package list

import "errors"

var (
	ErrNotFound = errors.New("list not found")
	ErrCreate   = errors.New("error creating list")
	ErrUpdate   = errors.New("error updating list")
	ErrDelete   = errors.New("error deleting list")
)
