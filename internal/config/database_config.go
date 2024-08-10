package config

import (
	"github.com/spf13/pflag"
	"github.com/spf13/viper"
)

const (
	DatabaseDsnFlag    = "database-dsn"
	DatabaseDsnEnv     = "DATABASE_DSN"
	DatabaseDsnProp    = "database.dsn"
	DatabaseDsnDefault = ""
)

type DatabaseConfig struct {
	Dsn string `mapstructure:"dsn"`
}

func BindDatabaseConfigFlags(flags *pflag.FlagSet) {
	flags.String(DatabaseDsnFlag, DatabaseDsnDefault, "")
	viper.BindEnv(DatabaseDsnProp, DatabaseDsnEnv)
	viper.BindPFlag(DatabaseDsnProp, flags.Lookup(DatabaseDsnFlag))
}
