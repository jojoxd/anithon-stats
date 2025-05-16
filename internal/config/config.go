package config

import "github.com/spf13/viper"

type Config struct {
	App    App    `mapstructure:"app"`
	Server Server `mapstructure:"server"`
}

func NewViper(v *viper.Viper) (*Config, error) {
	cfg := &Config{}

	err := v.Unmarshal(cfg)
	if err != nil {
		return nil, err
	}

	return cfg, nil
}
