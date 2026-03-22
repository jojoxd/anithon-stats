//go:build windows

package aslog

import (
	"log/slog"
	"os"

	"github.com/lmittmann/tint"
)

func getHandler() *handler {
	return &writableWindows{
		file: os.Stderr,
	}
}

type writableWindows struct {
	file *os.File
}

func (w writableWindows) Text(opts *slog.HandlerOptions) slog.Handler {
	return tint.NewHandler(w.file, &tint.Options{
		AddSource:   opts.AddSource,
		Level:       opts.Level,
		ReplaceAttr: opts.ReplaceAttr, // TODO: Custom Replacer
		// TimeFormat:  "",
		// NoColor:     false,
	})
}

func (w writableWindows) Json(opts *slog.HandlerOptions) *slog.JSONHandler {
	return slog.NewJSONHandler(w.file, opts)
}
