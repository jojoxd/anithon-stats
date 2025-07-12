package api

import (
	"fmt"

	"anistats/internal/config"
	"anistats/pkg/anistats_client"
)

type BundleFactory func(config.AppClient) (ClientBundle, error)

var bundleFactories = map[config.ClientType]BundleFactory{}

type ClientBundle interface {
	MediaService() anistats_client.MediaService
	UserService() anistats_client.UserService
}

func NewClientBundle(clientConfig config.AppClient) (ClientBundle, error) {
	clientType := config.ClientTypeRemote

	bundleFactory, ok := bundleFactories[clientType]
	if !ok {
		return nil, fmt.Errorf("client bundle '%s' not exist", clientType)
	}

	bundle, err := bundleFactory(clientConfig)
	if err != nil {
		return nil, err
	}

	return bundle, nil
}
