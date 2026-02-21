package dbal

import (
	"context"
	"time"

	"github.com/google/uuid"
	"golang.org/x/text/language"

	v1 "anistats/api/v1"
)

type UserRepository interface {
	GetUser(ctx context.Context, id uuid.UUID) (v1.User, error)
	ListUsers(ctx context.Context) ([]v1.User, error)
	ListUsersP(ctx context.Context, offset int64, limit int64) ([]v1.User, error)
	CreateUser(ctx context.Context, request CreateUserRequest) (v1.User, error)
	DeleteUser(ctx context.Context, id uuid.UUID) error
}

type MediaRepository interface {
	GetMedia(ctx context.Context, id uuid.UUID) (v1.Media, error)
	ListMedia(ctx context.Context) ([]v1.Media, error)
	ListMediaP(ctx context.Context, offset int64, limit int64) ([]v1.Media, error)
	CreateMedia(ctx context.Context, request CreateMediaRequest) (v1.Media, error)
	DeleteMedia(ctx context.Context, id uuid.UUID) error
}

type UserListRepository interface {
	Get(ctx context.Context, userlistId uuid.UUID) (v1.UserList, error)
	List(ctx context.Context) ([]v1.UserList, error)
	ListP(ctx context.Context, offset, limit int64) ([]v1.UserList, error)
	Create(ctx context.Context, userId uuid.UUID, req v1.CreateUserList) (v1.UserList, error)
	Update(ctx context.Context, userlistId uuid.UUID, req v1.UpdateUserList) (v1.UserList, error)
	Delete(ctx context.Context, userlistId uuid.UUID) error
	AddEntry(ctx context.Context, userlistId uuid.UUID, req v1.CreateUserListEntry) (v1.UserListEntry, error)
	GetEntry(ctx context.Context, entryId uuid.UUID) (v1.UserListEntry, error)
	GetEntries(ctx context.Context, userlistId uuid.UUID) ([]v1.UserListEntry, error)
	UpdateEntry(ctx context.Context, entryId uuid.UUID, req v1.UpdateUserListEntry) (v1.UserListEntry, error)
	DeleteEntry(ctx context.Context, entryId uuid.UUID) error
}

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
