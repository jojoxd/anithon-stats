package config

import (
	"fmt"

	"github.com/spf13/pflag"
	"github.com/spf13/viper"
)

type Config struct {
	Server   *ServerConfig   `mapstructure:"server"`
	Database *DatabaseConfig `mapstructure:"database"`
}

func NewViper() *Config {
	cfg := &Config{}

	x := viper.AllSettings()
	fmt.Printf("%v\n", x)

	if err := viper.Unmarshal(cfg); err != nil {
		fmt.Println(err)
	}

	return cfg
}

func BindFullConfigFlags(flags *pflag.FlagSet) {
	BindDatabaseConfigFlags(flags)
	BindServerConfigFlags(flags)
}
