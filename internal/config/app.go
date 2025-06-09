package config

import "net/url"

const (
	AppName    = "Anistats"
	AppVersion = "0.0.0-dev"
)

type App struct {
	Fullscreen bool      `mapstructure:"fullscreen"`
	Client     AppClient `mapstructure:"client"`
}

type AppClient struct {
	Type    ClientType `mapstructure:"type"`
	BaseUrl url.URL    `mapstructure:"base_url"`
}

type ClientType string

const (
	ClientTypeRemote   ClientType = "remote"
	ClientTypeEmbedded ClientType = "embedded"
)
