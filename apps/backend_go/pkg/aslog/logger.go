package aslog

import (
	"context"
	"log/slog"
	"runtime"
	"time"
)

type Logger struct {
	*slog.Logger
}

// Silly logs at [LevelSilly].
func (l Logger) Silly(msg string, args ...any) {
	l.log(context.Background(), LevelSilly.Level(), msg, args...)
}

// SillyContext logs at [LevelSilly] with the given context.
func (l Logger) SillyContext(ctx context.Context, msg string, args ...any) {
	l.log(ctx, LevelSilly.Level(), msg, args...)
}

// Sql logs at [LevelSql].
func (l Logger) Sql(msg string, args ...any) {
	l.log(context.Background(), LevelSql.Level(), msg, args...)
}

// SqlContext logs at [LevelSql] with the given context.
func (l Logger) SqlContext(ctx context.Context, msg string, args ...any) {
	l.log(ctx, LevelSql.Level(), msg, args...)
}

// Http logs at [LevelHttp].
func (l Logger) Http(msg string, args ...any) {
	l.log(context.Background(), LevelHttp.Level(), msg, args...)
}

// HttpContext logs at [LevelHttp] with the given context.
func (l Logger) HttpContext(ctx context.Context, msg string, args ...any) {
	l.log(ctx, LevelHttp.Level(), msg, args...)
}

func (l Logger) log(ctx context.Context, level slog.Level, msg string, args ...any) {
	if !l.Logger.Enabled(ctx, level) {
		return
	}

	var pcs [1]uintptr
	runtime.Callers(3, pcs[:]) // skip [Callers, log, LogMethod]

	r := slog.NewRecord(time.Now(), level, msg, pcs[0])
	r.Add(args...)

	_ = l.Logger.Handler().Handle(ctx, r)
}

func (l Logger) Slog() *slog.Logger {
	return l.Logger
}
