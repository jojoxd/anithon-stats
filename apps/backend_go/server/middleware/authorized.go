package middleware

import (
	"encoding/json"
	"net/http"

	"git.jojoxd.nl/projects/anistats/backend/api"
	"git.jojoxd.nl/projects/anistats/backend/internal/application"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/auth"
)

func Authorized(h http.Handler, authService *application.AuthService) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		cookie, err := r.Cookie("token")
		if err != nil {
			panic(err)
		}

		valid, claims, err := authService.ValidateToken(cookie.Value)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			bytes, err := json.Marshal(&api.Error{
				Code:    http.StatusUnauthorized,
				Message: "Unauthorized",
			})
			if err != nil {
				panic(err)
			}

			if _, err := w.Write(bytes); err != nil {
				panic(err)
			}

			return
		}

		if !valid {
			w.WriteHeader(http.StatusUnauthorized)
			bytes, err := json.Marshal(&api.Error{
				Code:    http.StatusUnauthorized,
				Message: "Unauthorized",
			})

			if err != nil {
				panic(err)
			}

			if _, err := w.Write(bytes); err != nil {
				panic(err)
			}

			return
		}

		r = r.WithContext(auth.NewContext(r.Context(), &auth.Authorization{
			Claims: claims,
		}))

		h.ServeHTTP(w, r)
	})
}
