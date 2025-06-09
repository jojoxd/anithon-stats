package config

import "anistats/internal/server"

type Config struct {
	Server *server.Config `mapstructure:"server"`
}
