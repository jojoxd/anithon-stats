package middleware

import (
	"log/slog"
	"net/http"
	"time"

	"anistats/internal/logging"
)

type Logging struct {
	logger *slog.Logger
}

func NewLogging(logger *slog.Logger) *Logging {
	return &Logging{
		logger: logger,
	}
}

func (l Logging) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		lw := &loggingResponseWriter{ResponseWriter: w}

		next.ServeHTTP(lw, r)

		context := slog.Group("http",
			slog.Duration("dur", time.Since(start)),
			slog.Group("req",
				slog.String("method", r.Method),
				slog.String("path", r.URL.Path),
				slog.String("remote_addr", r.RemoteAddr),
			),
			slog.Group("res",
				slog.Int("code", lw.statusCode),
			),
		)

		l.logger.Log(r.Context(), logging.LevelHttp.Level(), "request completed", context)
	})
}

type loggingResponseWriter struct {
	http.ResponseWriter

	statusCode int
}

func (w *loggingResponseWriter) WriteHeader(statusCode int) {
	w.statusCode = statusCode

	w.ResponseWriter.WriteHeader(statusCode)
}
