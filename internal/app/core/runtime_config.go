package core

import (
	"io"
)

type RuntimeConfig interface {
	Client() RuntimeClientConfig

	Load(io.Reader) error
	Save(io.Writer) error
	Validate() error
	Event() <-chan RuntimeConfigEvent
}

type RuntimeConfigEvent interface {
	ImplementsRuntimeConfigEvent()
}

type RuntimeClientConfig interface {
	ClientType() string
}

type RuntimeConfigUpdateEvent struct {
	Path     string
	OldValue string
	NewValue string
}

func (e RuntimeConfigUpdateEvent) ImplementsRuntimeConfigEvent() {}

type RuntimeConfigWriteEvent struct{}

func (e RuntimeConfigWriteEvent) ImplementsRuntimeConfigEvent() {}

type RuntimeConfigReadEvent struct{}

func (e RuntimeConfigReadEvent) ImplementsRuntimeConfigEvent() {}
