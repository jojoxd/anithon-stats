package config

import (
	"net/url"

	"github.com/spf13/viper"
)

type Dbal struct {
	Dsn string `mapstructure:"dsn"`
}

func (c Dbal) bind(v *viper.Viper) {
	v.SetDefault("database.dsn", "sqlite://./database.sqlite")
	v.BindEnv("database.dsn")
}

func (c Dbal) Type() DbalType {
	uri, err := url.Parse(c.Dsn)
	if err != nil {
		panic(err)
	}

	return DbalType(uri.Scheme)
}

type DbalType string

const (
	DbalTypePostgres DbalType = "postgres"
	DbalTypeMySQL    DbalType = "mysql"
	DbalTypeSqlite   DbalType = "sqlite"
)
