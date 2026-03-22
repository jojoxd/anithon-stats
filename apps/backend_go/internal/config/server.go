package config

import "github.com/spf13/viper"

type Server struct {
	Host      string `mapstructure:"host"`
	Port      int16  `mapstructure:"port"`
	PublicUrl string `mapstructure:"publicUrl"`
}

func (c Server) bind(v *viper.Viper) {
	v.SetDefault("server.host", "localhost")
	v.BindEnv("server.host")

	v.SetDefault("server.port", 8083)
	v.BindEnv("server.port")

	v.SetDefault("server.publicUrl", "http://localhost:8083")
	v.BindEnv("server.publicUrl")
}
