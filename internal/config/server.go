package config

type Server struct {
	Host string `mapstructure:"host"`
	Port int16  `mapstructure:"port"`
}
