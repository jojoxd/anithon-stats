package application

import (
	"context"
	"net/url"
	"path"

	"git.jojoxd.nl/projects/aslog"
	"github.com/golang-jwt/jwt/v5"

	"git.jojoxd.nl/projects/anistats/backend/ent"
	"git.jojoxd.nl/projects/anistats/backend/internal/anilist"
	"git.jojoxd.nl/projects/anistats/backend/internal/config"

	"git.jojoxd.nl/projects/anistats/backend/internal/domain"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/auth"
)

type AuthService struct {
	authConfig         config.Auth
	serverConfig       config.Server
	anilistAuthService *domain.AnilistAuthService
	tokenService       *domain.TokenService
	userService        *UserService
	logger             *aslog.Logger
}

type Claims struct {
	AnilistToken string `json:"anilist"`
	jwt.RegisteredClaims
}

func NewAuthService(
	authConfig config.Auth,
	serverConfig config.Server,
	anilistAuthService *domain.AnilistAuthService,
	tokenService *domain.TokenService,
	userService *UserService,
	logger *aslog.Logger,
) *AuthService {
	return &AuthService{
		authConfig:         authConfig,
		serverConfig:       serverConfig,
		anilistAuthService: anilistAuthService,
		tokenService:       tokenService,
		userService:        userService,
		logger:             logger,
	}
}

func (s AuthService) GetAuthorizeUrl() string {
	return s.anilistAuthService.GetAuthorizeUrl(s.getRedirectUrl())
}

func (s AuthService) getRedirectUrl() string {
	redirectUri, err := url.Parse(s.serverConfig.PublicUrl)
	if err != nil {
		panic(err)
	}

	redirectUri.Path = path.Join(redirectUri.Path, "api/auth/redirect")

	return redirectUri.String()
}

func (s AuthService) HandleRedirect(ctx context.Context, anilistCode string) (token string, claims *auth.Claims, err error) {
	anilistToken, err := s.anilistAuthService.ExchangeCode(ctx, anilistCode, s.getRedirectUrl())
	if err != nil {
		return "", nil, err
	}

	anilistClient := anilist.NewClient(anilist.WithToken(anilistToken))

	anilistCurrentUser, err := anilistClient.GetCurrentUser(ctx)
	if err != nil {
		return "", nil, err
	}

	user, err := s.userService.GetByAnilistId(ctx, uint(anilistCurrentUser.Id))
	if ent.IsNotFound(err) {
		user, err = s.userService.CreateByAnilistId(ctx, uint(anilistCurrentUser.Id))
	}

	if err != nil {
		return "", nil, err
	}

	return s.tokenService.CreateToken(user, anilistToken)
}

func (s AuthService) ValidateToken(token string) (valid bool, claims *auth.Claims, err error) {
	return s.tokenService.ValidateToken(token)
}
