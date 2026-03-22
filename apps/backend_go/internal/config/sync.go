package config

import (
	"runtime"

	"github.com/spf13/viper"
)

type Sync struct {
	Workers uint8 `mapstructure:"workers"`
}

func (c Sync) bind(v *viper.Viper) {
	v.SetDefault("sync.workers", runtime.GOMAXPROCS(0))
	v.BindEnv("sync.workers")
}
