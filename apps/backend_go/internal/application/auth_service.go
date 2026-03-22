package application

import (
	"context"
	"database/sql"
	"errors"
	"net/url"
	"path"
	"strconv"

	"github.com/golang-jwt/jwt/v5"

	"git.jojoxd.nl/projects/anistats/backend/internal/anilist"
	"git.jojoxd.nl/projects/anistats/backend/internal/config"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/auth"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/repository"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"
)

type AuthService struct {
	authConfig         config.Auth
	serverConfig       config.Server
	anilistAuthService *domain.AnilistAuthService
	tokenService       *domain.TokenService
	userRepository     repository.User
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
	userRepository repository.User,
	logger *aslog.Logger,
) *AuthService {
	return &AuthService{
		authConfig:         authConfig,
		serverConfig:       serverConfig,
		anilistAuthService: anilistAuthService,
		tokenService:       tokenService,
		userRepository:     userRepository,
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

	anilistCurrentUserId := strconv.Itoa(anilistCurrentUser.Id)
	user, err := s.userRepository.GetUserByAnilistId(ctx, anilistCurrentUserId)
	if err != nil && errors.Is(err, sql.ErrNoRows) {
		user, err = s.userRepository.CreateUser(ctx, repository.CreateUserDto{
			Name:      anilistCurrentUser.Name,
			AnilistId: anilistCurrentUserId,

			AvatarUrl: sql.NullString{
				String: anilistCurrentUser.Avatar.Large,
				Valid:  true,
			},
		})
	}

	if err != nil {
		return "", nil, err
	}

	return s.tokenService.CreateToken(user, anilistToken)
}

func (s AuthService) ValidateToken(token string) (valid bool, claims *auth.Claims, err error) {
	return s.tokenService.ValidateToken(token)
}
