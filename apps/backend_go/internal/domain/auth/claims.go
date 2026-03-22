package auth

import "github.com/golang-jwt/jwt/v5"

type Claims struct {
	AnilistToken string `json:"anilist_token"`
	jwt.RegisteredClaims
}
