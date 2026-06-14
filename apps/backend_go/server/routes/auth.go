package routes

import (
	"net/http"

	"git.jojoxd.nl/projects/aslog"

	"git.jojoxd.nl/projects/anistats/backend/internal/application"
)

func HandleAuthLogin(authService *application.AuthService) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Location", authService.GetAuthorizeUrl())
		w.WriteHeader(http.StatusFound)
	})
}

func HandleAuthRedirect(authService *application.AuthService, logger *aslog.Logger) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !r.URL.Query().Has("code") {
			encodeError(w, r, http.StatusBadRequest, "Bad Request")

			return
		}

		anilistCode := r.URL.Query().Get("code")

		token, claims, err := authService.HandleRedirect(r.Context(), anilistCode)

		if err != nil {
			logger.Info("failed to create token on redirect", "err", err)
			encodeError(w, r, http.StatusInternalServerError, "Internal Server Error")
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:     "token",
			Value:    token,
			Expires:  claims.ExpiresAt.Time,
			Secure:   false, // todo re-enable?
			HttpOnly: true,
			SameSite: 1,

			Domain: "http://localhost:4200",
			Path:   "/",
		})

		w.Header().Set("Location", "/")
		w.WriteHeader(http.StatusFound)
	})
}

func HandleAuthLogout() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.SetCookie(w, &http.Cookie{
			Name:   "token",
			Value:  "",
			MaxAge: -1,
			Path:   "/",
		})

		w.Header().Set("Location", "/")
		w.WriteHeader(http.StatusFound)
	})
}
