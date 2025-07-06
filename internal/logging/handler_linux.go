//go:build linux

package logging

import (
	"log/slog"
	"os"

	"github.com/lmittmann/tint"
	"github.com/mattn/go-isatty"
)

func getHandler() handler {
	return &writableLinux{
		file: os.Stderr,
	}
}

type writableLinux struct {
	file *os.File
}

func (w writableLinux) Text(opts *slog.HandlerOptions) slog.Handler {
	return tint.NewHandler(w.file, &tint.Options{
		AddSource:   opts.AddSource,
		Level:       opts.Level,
		ReplaceAttr: opts.ReplaceAttr, // TODO: Custom replacer
		// TimeFormat:  "",
		NoColor: !isatty.IsTerminal(w.file.Fd()),
	})
}

func (w writableLinux) Json(opts *slog.HandlerOptions) *slog.JSONHandler {
	return slog.NewJSONHandler(w.file, opts)
}
