package server

import (
	"context"
	"errors"
	"log/slog"
	"net/http"

	"anistats/internal/logging"
	"anistats/internal/server/dbal"
	"anistats/internal/server/dbal/sqlite"
	"anistats/internal/server/http/controller"
	"anistats/internal/server/http/middleware"
	"anistats/internal/server/server_api"
	"anistats/pkg/cache"
	"anistats/pkg/cache_fs"

	"github.com/gorilla/mux"
)

type Server struct {
	router *mux.Router
	db     dbal.Database
	cache  cache.Cache
}

func New() (*Server, error) {
	db, err := sqlite.New(sqlite.Config{Path: "./test.db"}, slog.Default())
	if err != nil {
		return nil, err
	}

	cfs, err := cache_fs.New(
		cache_fs.WithStripSlashes(),
		cache_fs.WithDirectory("/home/jojoxd/.cache/anistats"),
	)
	if err != nil {
		return nil, err
	}

	server := &Server{
		router: mux.NewRouter(),
		db:     db,
		cache:  cache.New(cfs),
	}

	return server, nil
}

func (s *Server) Database() dbal.Database {
	return s.db
}

func (s *Server) Serve(ctx context.Context) error {
	loggingMiddleware := middleware.NewLogging(slog.Default())
	s.router.Use(loggingMiddleware.Middleware)

	mediaRepository, err := s.db.MediaRepository(ctx)
	if err != nil {
		return err
	}

	mediaService := server_api.NewMediaService(mediaRepository, s.cache)
	mediaController := controller.NewMedia(mediaService)
	mediaController.Register(s.router)

	userRepository, err := s.db.UserRepository(ctx)
	if err != nil {
		return err
	}
	userService := server_api.NewUserService(userRepository)
	userController := controller.NewUser(userService)
	userController.Register(s.router)

	userListRepository, err := s.db.UserListRepository(ctx)
	if err != nil {
		return err
	}
	userListService := server_api.NewUserListService(userListRepository)
	userListController := controller.NewUserList(userListService)
	userListController.Register(s.router)

	if err := s.router.Walk(log); err != nil {
		panic(err)
	}

	slog.Info("Starting server on :8000")
	return http.ListenAndServe(":8000", s.router)
}

func log(route *mux.Route, _ *mux.Router, _ []*mux.Route) error {
	pathTemplate, err := route.GetPathTemplate()
	if err != nil {
		return err
	}

	methods, err := route.GetMethods()
	if err != nil {
		if errors.Is(err, route.GetError()) {
			return err
		}

		methods = []string{"ALL"}
	}

	group := slog.Group("route",
		slog.String("path", pathTemplate),
		slog.Any("methods", methods),
	)

	slog.Default().Log(context.TODO(), logging.LevelHttp.Level(), "registered route", group)

	return nil
}
