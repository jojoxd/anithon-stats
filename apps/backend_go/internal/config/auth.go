package config

import (
	"time"

	"github.com/spf13/viper"
)

type Auth struct {
	Anilist    AuthAnilist `mapstructure:"anilist"`
	Token      AuthToken   `mapstructure:"token"`
	SigningKey string      `mapstructure:"signingKey"`
}

type AuthToken struct {
	Issuer string        `mapstructure:"iss"`
	Expiry time.Duration `mapstructure:"expiry"`
}

type AuthAnilist struct {
	ClientId     string `mapstructure:"clientId"`
	ClientSecret string `mapstructure:"clientSecret"`
}

func (c Auth) bind(v *viper.Viper) {
	v.SetDefault("auth.anilist.clientId", nil)
	v.BindEnv("auth.anilist.clientId")

	v.SetDefault("auth.anilist.clientSecret", nil)
	v.BindEnv("auth.anilist.clientSecret")

	v.SetDefault("auth.signingKey", nil)
	v.BindEnv("auth.signingKey")

	v.SetDefault("auth.token.issuer", "anistats")
	v.SetDefault("auth.token.expiry", time.Hour*24*356-1)
}
