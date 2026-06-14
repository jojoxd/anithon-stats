package middleware

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"runtime/debug"

	"git.jojoxd.nl/projects/aslog"

	"git.jojoxd.nl/projects/anistats/backend/api"
)

func Panic(h http.Handler, logger *aslog.Logger) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if r := recover(); r != nil {
				logger.Error("recovered from panic",
					slog.Any("err", r),
					slog.Any("stack", string(debug.Stack())),
				)

				w.WriteHeader(http.StatusInternalServerError)

				bytes, err := json.Marshal(&api.Error{
					Code:    http.StatusInternalServerError,
					Message: "Internal Server Error",
				})

				if err != nil {
					panic(err)
				}

				if _, err := w.Write(bytes); err != nil {
					panic(err)
				}
			}
		}()

		h.ServeHTTP(w, r)
	})
}
