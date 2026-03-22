package config

import (
	"github.com/spf13/viper"
)

type Config struct {
	Auth   Auth   `mapstructure:"auth"`
	Dbal   Dbal   `mapstructure:"database"`
	Server Server `mapstructure:"server"`
	Sync   Sync   `mapstructure:"sync"`
}

func (c Config) bind(v *viper.Viper) {
	c.Auth.bind(v)
	c.Dbal.bind(v)
	c.Server.bind(v)
	c.Sync.bind(v)
}
