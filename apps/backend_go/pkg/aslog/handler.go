package aslog

import (
	"fmt"
	"log/slog"

	"github.com/lmittmann/tint"
)

type handler interface {
	Text(opts *slog.HandlerOptions) slog.Handler
	Json(opts *slog.HandlerOptions) *slog.JSONHandler
}

type outputType string

const (
	outputTypeJson outputType = "json"
	outputTypeText outputType = "text"
)

func replaceAttr(groups []string, attr slog.Attr) slog.Attr {
	switch attr.Key {
	case slog.LevelKey:
		// Map to our levels
		if level, ok := attr.Value.Any().(level); ok {
			return tint.Attr(level.Color(), slog.String(attr.Key, level.String()))
		}

		// Also try to map slog to ours
		if level, ok := attr.Value.Any().(slog.Level); ok {
			mappedLevel := mapSlogLevel(level)

			return tint.Attr(mappedLevel.Color(), slog.String(attr.Key, mappedLevel.String()))
		}

		panic(fmt.Sprintf("invalid level: %#v, %T", attr, attr))

	// See server/dbal/utils/logging.go
	case "query.query":
		return tint.Attr(ansiCyan, attr)
	}

	if attr.Value.Kind() == slog.KindAny {
		switch attr.Value.Any().(type) {
		case error:
			return tint.Attr(ansiDarkRed, attr)
		}
	}

	return attr
}
