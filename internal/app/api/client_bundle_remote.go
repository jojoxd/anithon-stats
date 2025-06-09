package api

import (
	"net/http"

	"anistats/internal/config"
	"anistats/pkg/anistats_client"
	"anistats/pkg/anistats_client_http"
)

var _ ClientBundle = (*clientBundleRemote)(nil)

type clientBundleRemote struct {
	cfg          config.AppClient
	httpClient   *anistats_client_http.HttpClient
	mediaService anistats_client.MediaService
	userService  anistats_client.UserService
}

func newClientBundleRemote(cfg config.AppClient) ClientBundle {
	return &clientBundleRemote{
		cfg: cfg,
		httpClient: anistats_client_http.NewHttpClient(
			http.Client{},
			anistats_client_http.HttpClientConfig{
				BaseUrl: &cfg.BaseUrl,
			},
		),
	}
}

func (b *clientBundleRemote) MediaService() anistats_client.MediaService {
	if b.mediaService == nil {
		b.mediaService = anistats_client_http.NewMediaService(b.httpClient)
	}

	return b.mediaService
}

func (b *clientBundleRemote) UserService() anistats_client.UserService {
	if b.userService == nil {
		b.userService = anistats_client_http.NewUserService(b.httpClient)
	}

	return b.userService
}
