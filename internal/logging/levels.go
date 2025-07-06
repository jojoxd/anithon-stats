package logging

import (
	"fmt"
	"log/slog"
	"strconv"
	"strings"
)

const (
	LevelSilly     = level(-8)
	LevelSql       = level(-5)
	LevelDebug     = level(-4)
	LevelInfo      = level(0)
	LevelWarn      = level(4)
	LevelError     = level(8)
	LevelEmergency = level(12)
)

func mapSlogLevel(level slog.Level) level {
	switch level {
	case LevelSilly.Level():
		return LevelSilly

	case LevelSql.Level():
		return LevelSql

	case LevelDebug.Level():
		return LevelDebug

	case LevelInfo.Level():
		return LevelInfo

	case LevelWarn.Level():
		return LevelWarn

	case LevelError.Level():
		return LevelError

	case LevelEmergency.Level():
		return LevelEmergency
	}

	if int(level) < int(LevelSilly) {
		return LevelSilly
	}

	if int(level) > int(LevelEmergency) {
		return LevelEmergency
	}

	panic(fmt.Sprintf("invalid level: %#v", level))
}

func parseLogLevel(levelStr string) level {
	switch strings.ToLower(levelStr) {
	case "silly":
		return LevelSilly

	case "sql":
		return LevelSql

	case "debug":
		return LevelDebug

	case "info":
		return LevelInfo

	case "warn":
		return LevelWarn

	case "error":
		return LevelError

	case "emergency":
		return LevelEmergency

	default:
		i, err := strconv.Atoi(levelStr)
		if err != nil {
			panic(fmt.Sprintf("invalid level: %s", levelStr))
		}

		return mapSlogLevel(slog.Level(i))
	}
}
