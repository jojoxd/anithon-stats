package external

type Logger interface {
	Warn(message string, args ...any)
	Info(message string, args ...any)
	Debug(message string, args ...any)
}
