package external

import "fmt"

type Logger interface {
	Warn(message string, args ...any)
	Info(message string, args ...any)
}

type nilLogger struct{}

func (nilLogger) Warn(_ string, _ ...any) {}
func (nilLogger) Info(_ string, _ ...any) {}

func NewNilLogger() Logger {
	return nilLogger{}
}

type prefixLogger struct {
	prefix string
	inner  Logger
}

func NewPrefixLogger(prefix string, inner Logger) Logger {
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
