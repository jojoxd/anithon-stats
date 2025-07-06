package dbal

import (
	"context"
	"time"

	"golang.org/x/text/language"

	v1 "anistats/api/v1"
)

type UserRepository interface {
	GetUser(ctx context.Context, id v1.UserId) (v1.User, error)
	ListUsers(ctx context.Context) ([]v1.User, error)
	ListUsersP(ctx context.Context, offset int64, limit int64) ([]v1.User, error)
	CreateUser(ctx context.Context, request CreateUserRequest) (v1.User, error)
	DeleteUser(ctx context.Context, id v1.UserId) error
}

type MediaRepository interface {
	GetMedia(ctx context.Context, id v1.MediaId) (v1.Media, error)
	ListMedia(ctx context.Context) ([]v1.Media, error)
	ListMediaP(ctx context.Context, offset int64, limit int64) ([]v1.Media, error)
	CreateMedia(ctx context.Context, request CreateMediaRequest) (v1.Media, error)
	DeleteMedia(ctx context.Context, id v1.MediaId) error
}

// todo move requests

type CreateUserRequest struct {
	Name string
}

type CreateMediaRequest struct {
	DisplayName      CreateTranslationRequest
	Description      string
	EpisodesTotal    int64
	EpisodesDuration time.Duration
}

type CreateTranslationRequest struct {
	Translations map[language.Tag]string
}
