package server

import (
	"net/http"

	"git.jojoxd.nl/projects/anistats/backend/internal/application"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"
	"git.jojoxd.nl/projects/anistats/backend/server/middleware"
	"git.jojoxd.nl/projects/anistats/backend/server/routes"
)

func addRoutes(
	mux *http.ServeMux,
	userService *application.UserService,
	listService *application.ListService,
	searchService *application.SearchService,
	authService *application.AuthService,
	logger *aslog.Logger,
) {
	authorized := func(h http.Handler) http.Handler {
		return middleware.Authorized(h, authService)
	}

	mux.Handle("GET /api/auth/login", routes.HandleAuthLogin(authService))
	mux.Handle("GET /api/auth/redirect", routes.HandleAuthRedirect(authService, logger))
	mux.Handle("GET /api/auth/logout", routes.HandleAuthLogout())

	mux.Handle("GET /api/list/{listId}", routes.HandleListGet(listService))
	mux.Handle("POST /api/list/update", authorized(routes.HandleListUpdate(listService)))
	mux.Handle("GET /api/list/{listId}/image.png", routes.HandleListImagePng(listService))
	mux.Handle("GET /api/list/{listId}/image.svg", routes.HandleListImageSvg(listService))
	mux.Handle("POST /api/list/{listId}/entry/update", routes.HandleListEntryUpdate())

	mux.Handle("POST /api/search/anime", authorized(routes.HandleSearchAnime(searchService)))
	mux.Handle("POST /api/search/global", authorized(routes.HandleSearchGlobal(searchService)))

	mux.Handle("GET /api/user", authorized(routes.HandleGetCurrentUser(userService, logger)))
	mux.Handle("GET /api/user/{userId}", routes.HandleGetUser(userService))
	mux.Handle("GET /api/user/{userId}/lists", routes.HandleGetUserLists(userService))
}
