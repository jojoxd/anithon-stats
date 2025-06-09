package api

import (
	"fmt"

	"anistats/internal/config"
	"anistats/pkg/anistats_client"
)

type ClientBundle interface {
	MediaService() anistats_client.MediaService
	UserService() anistats_client.UserService
}

func NewClientBundle(clientConfig config.AppClient) (ClientBundle, error) {
	switch clientConfig.Type {
	case config.ClientTypeRemote:
		return newClientBundleRemote(clientConfig), nil

	case config.ClientTypeEmbedded:
		return newClientBundleEmbedded(clientConfig), nil
	}

	return nil, fmt.Errorf(`unknown client type "%s"`, clientConfig.Type)
}
