package server

type Config struct {
	Host string `mapstructure:"host"`
	Port uint16 `mapstructure:"port"`

	Cache CacheConfig `mapstructure:"cache"`
}

type CacheConfig struct {
	directory string `mapstructure:"directory"`
}
