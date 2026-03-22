package domain

import (
	"time"

	"github.com/golang-jwt/jwt/v5"

	"git.jojoxd.nl/projects/anistats/backend/internal/config"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/auth"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/entity"
)

type TokenService struct {
	config config.Auth
}

func NewTokenService(config config.Auth) *TokenService {
	return &TokenService{config}
}

func (s TokenService) CreateToken(user *entity.User, anilistToken string) (string, *auth.Claims, error) {
	claims := &auth.Claims{
		AnilistToken: anilistToken,

		RegisteredClaims: jwt.RegisteredClaims{
			ID:        "jti",
			Issuer:    s.config.Token.Issuer,
			Subject:   user.Id,
			Audience:  jwt.ClaimStrings{s.audience()},
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(s.config.Token.Expiry)),
			NotBefore: jwt.NewNumericDate(time.Now()),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(s.signingKey())

	return signedToken, claims, err
}

func (s TokenService) signingKey() []byte {
	return []byte(s.config.SigningKey)
}

func (s TokenService) audience() string {
	return "anistats-backend"
}

func (s TokenService) ValidateToken(token string) (valid bool, claims *auth.Claims, err error) {
	keyfunc := func(token *jwt.Token) (interface{}, error) {
		return s.signingKey(), nil
	}

	claims = &auth.Claims{}
	parsedToken, err := jwt.ParseWithClaims(token, claims, keyfunc,
		jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}),
		jwt.WithIssuer(s.config.Token.Issuer),
		jwt.WithAudience(s.audience()),
		jwt.WithExpirationRequired(),
		jwt.WithIssuedAt(),
		jwt.WithNotBeforeRequired(),
	)

	if err != nil {
		return false, nil, err
	}

	return parsedToken.Valid, claims, nil
}
