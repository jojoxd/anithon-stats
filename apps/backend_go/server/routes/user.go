package routes

import (
	"net/http"

	"git.jojoxd.nl/projects/anistats/backend/api"
	"git.jojoxd.nl/projects/anistats/backend/internal/application"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/auth"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"
)

func HandleGetCurrentUser(userService *application.UserService, logger *aslog.Logger) http.Handler {
	type UserResponse struct {
		User *api.User `json:"user"`
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authorization, ok := auth.FromContext(r.Context())
		if !ok {
			logger.Warn("no contextual authorization")
			internalServerError(w, r)
			return
		}

		user, err := userService.GetUser(r.Context(), authorization.Subject)
		if err != nil {
			logger.Error("failed to get user", "user_id", authorization.Subject, "err", err)
			// todo log it
			internalServerError(w, r)
			return
		}

		encode(w, r, http.StatusOK, &UserResponse{User: user})
	})
}

func HandleGetUser(userService *application.UserService) http.Handler {
	type UserResponse struct {
		User *api.User `json:"user"`
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user, err := userService.GetUser(r.Context(), r.PathValue("userId"))
		if err != nil {
			// todo log it
			internalServerError(w, r)
			return
		}

		encode(w, r, http.StatusOK, &UserResponse{User: user})
	})
}

func HandleGetUserLists(userService *application.UserService) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		lists, err := userService.GetLists(r.Context(), r.PathValue("userId"))
		if err != nil {
			// todo log it
			internalServerError(w, r)
			return
		}

		encode(w, r, http.StatusOK, lists)
	})
}
