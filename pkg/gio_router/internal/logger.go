package internal

import (
	"fmt"

	"anistats/pkg/gio_router/external"
)

type nilLogger struct{}

func (nilLogger) Warn(_ string, _ ...any)  {}
func (nilLogger) Info(_ string, _ ...any)  {}
func (nilLogger) Debug(_ string, _ ...any) {}

func NewNilLogger() external.Logger {
	return nilLogger{}
}

type prefixLogger struct {
	prefix string
	inner  external.Logger
}

func NewPrefixLogger(prefix string, inner external.Logger) external.Logger {
	return prefixLogger{
		prefix: prefix,
		inner:  inner,
	}
}

func (p prefixLogger) Warn(message string, args ...any) {
	p.inner.Warn(fmt.Sprintf("%s: %s", p.prefix, message), args...)
}

func (p prefixLogger) Info(message string, args ...any) {
	p.inner.Info(fmt.Sprintf("%s: %s", p.prefix, message), args...)
}

func (p prefixLogger) Debug(message string, args ...any) {
	p.inner.Debug(fmt.Sprintf("%s: %s", p.prefix, message), args...)
}
