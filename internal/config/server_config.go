package config

import (
	"github.com/spf13/pflag"
	"github.com/spf13/viper"
)

const (
	ServerHostFlag    = "host"
	ServerHostEnv     = "HOST"
	ServerHostProp    = "server.host"
	ServerHostDefault = "0.0.0.0"

	ServerPortFlag    = "port"
	ServerPortEnv     = "PORT"
	ServerPortProp    = "server.port"
	ServerPortDefault = 8008
)

type ServerConfig struct {
	Host string `mapstructure:"host"`
	Port uint32 `mapstructure:"port"`
}

func BindServerConfigFlags(flags *pflag.FlagSet) {
	flags.String(ServerHostFlag, ServerHostDefault, "")
	viper.BindEnv(ServerHostProp, ServerHostEnv)
	viper.BindPFlag(ServerHostProp, flags.Lookup(ServerHostFlag))

	flags.Int16(ServerPortFlag, ServerPortDefault, "")
	viper.BindEnv(ServerPortProp, ServerPortEnv)
	viper.BindPFlag(ServerPortProp, flags.Lookup(ServerPortFlag))
}
