package middleware

import (
	"log/slog"
	"net/http"
	"time"

	"git.jojoxd.nl/projects/aslog"
)

type logResponseWriter struct {
	http.ResponseWriter

	statusCode int
	contentLen int
}

func (lrw *logResponseWriter) WriteHeader(statusCode int) {
	lrw.ResponseWriter.WriteHeader(statusCode)
	lrw.statusCode = statusCode
}

func (lrw *logResponseWriter) Write(b []byte) (int, error) {
	sz, err := lrw.ResponseWriter.Write(b)
	lrw.contentLen += sz

	return sz, err
}

func Log(h http.Handler, logger *aslog.Logger) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		req := slog.Group("req",
			slog.Any("method", r.Method),
			slog.Any("path", r.URL.Path),
			slog.Any("query", r.URL.RawQuery),
			slog.Any("remote_addr", r.RemoteAddr),
			slog.Any("content_length", r.ContentLength),
		)

		logger.HttpContext(r.Context(), "request", req)

		lrw := &logResponseWriter{ResponseWriter: w}

		timeStart := time.Now()

		h.ServeHTTP(lrw, r)

		res := slog.Group("res",
			slog.Any("status", lrw.statusCode),
			slog.Any("content_length", lrw.contentLen),
			slog.Duration("duration", time.Since(timeStart)),
		)

		logger.HttpContext(r.Context(), "response", req, res)
	})
}
