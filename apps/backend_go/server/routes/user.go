package routes

import (
	"net/http"

	"git.jojoxd.nl/projects/aslog"
	"github.com/google/uuid"

	"git.jojoxd.nl/projects/anistats/backend/api"
	"git.jojoxd.nl/projects/anistats/backend/internal/application"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/auth"
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

		userId, err := uuid.Parse(authorization.Subject)
		if err != nil {
			panic(err)
		}

		user, err := userService.GetById(r.Context(), userId)
		if err != nil {
			logger.Error("failed to get user", "user_id", authorization.Subject, "err", err)
			// todo log it
			internalServerError(w, r)
			return
		}

		encode(w, r, http.StatusOK, &UserResponse{User: &api.User{
			Id:     user.ID.String(),
			Name:   user.Name,
			Avatar: *user.AvatarURL,
		}})
	})
}

func HandleGetUser(userService *application.UserService) http.Handler {
	type UserResponse struct {
		User *api.User `json:"user"`
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userId, err := uuid.Parse(r.PathValue("userId"))
		if err != nil {
			panic(err)
		}

		user, err := userService.GetById(r.Context(), userId)
		if err != nil {
			// todo log it
			internalServerError(w, r)
			return
		}

		encode(w, r, http.StatusOK, &UserResponse{User: &api.User{
			Id:     user.ID.String(),
			Name:   user.Name,
			Avatar: *user.AvatarURL,
		}})
	})
}

func HandleGetUserLists(listService *application.ListService) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userId, err := uuid.Parse(r.PathValue("userId"))
		if err != nil {
			panic(err)
		}

		listMetadatas, err := listService.GetAllByUserId(r.Context(), userId)
		if err != nil {
			// todo log it
			internalServerError(w, r)
			return
		}

		encode(w, r, http.StatusOK, listMetadatas)
	})
}
