package api

import (
	"anistats/internal/config"
	"anistats/internal/server/server_api"
	"anistats/pkg/anistats_client"
)

var _ ClientBundle = (*clientBundleEmbedded)(nil)

type clientBundleEmbedded struct {
	mediaService anistats_client.MediaService
	userService  anistats_client.UserService
}

func newClientBundleEmbedded(cfg config.AppClient) ClientBundle {
	return &clientBundleEmbedded{}
}

func (b *clientBundleEmbedded) MediaService() anistats_client.MediaService {
	if b.mediaService == nil {
		b.mediaService = server_api.NewMediaService()
	}

	return b.mediaService
}

func (b *clientBundleEmbedded) UserService() anistats_client.UserService {
	if b.userService == nil {
		b.userService = server_api.NewUserService()
	}

	return b.userService
}
