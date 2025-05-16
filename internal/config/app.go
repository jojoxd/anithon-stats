package config

const (
	AppName    = "Anistats"
	AppVersion = "0.0.0-dev"
)

type App struct {
	Fullscreen bool `mapstructure:"fullscreen"`
}
