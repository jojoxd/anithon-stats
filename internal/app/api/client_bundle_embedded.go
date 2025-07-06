package api

import (
	"log/slog"

	"anistats/internal/config"
	"anistats/internal/server/dbal"
	"anistats/internal/server/dbal/sqlite"
	"anistats/internal/server/server_api"
	"anistats/pkg/anistats_client"
)

var _ ClientBundle = (*clientBundleEmbedded)(nil)

type clientBundleEmbedded struct {
	db           dbal.Database
	mediaService anistats_client.MediaService
	userService  anistats_client.UserService
}

func newClientBundleEmbedded(cfg config.AppClient) ClientBundle {
	db, err := sqlite.New(sqlite.Config{Path: "test.db"}, slog.Default())
	if err != nil {
		panic(err)
	}

	return &clientBundleEmbedded{
		db: db,
	}
}

func (b *clientBundleEmbedded) MediaService() anistats_client.MediaService {
	if b.mediaService == nil {
		b.mediaService = server_api.NewMediaService()
	}

	return b.mediaService
}

func (b *clientBundleEmbedded) UserService() anistats_client.UserService {
	if b.userService == nil {
		b.userService = server_api.NewUserService(b.db)
	}

	return b.userService
}
