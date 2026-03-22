package config

import (
	"errors"
	"path"
	"strings"

	"github.com/adrg/xdg"
	"github.com/spf13/pflag"
	"github.com/spf13/viper"
)

func Unmarshal(configFile string, pflags *pflag.FlagSet) (*Config, error) {
	v := viper.New()

	v.SetConfigName("server")
	v.SetConfigType("yaml")

	if configFile != "" {
		v.SetConfigFile(configFile)
	} else {
		v.AddConfigPath(".")
		v.AddConfigPath(path.Join(xdg.ConfigHome, "anistats"))
	}

	v.SetEnvPrefix("anistats")
	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	v.AutomaticEnv()

	config := &Config{}
	config.bind(v)

	if err := v.ReadInConfig(); err != nil && !errors.Is(err, viper.ConfigFileNotFoundError{}) {
		return nil, err
	}

	if err := v.BindPFlags(pflags); err != nil {
		return nil, err
	}

	if err := v.Unmarshal(config); err != nil {
		return nil, err
	}

	return config, nil
}
