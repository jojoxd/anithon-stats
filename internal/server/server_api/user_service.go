package server_api

import (
	"context"
	"image"

	v1 "anistats/api/v1"
	"anistats/internal/server/dbal"
	"anistats/pkg/anistats_client"
)

var _ anistats_client.UserService = (*UserService)(nil)

type UserService struct {
	db dbal.Database
}

func NewUserService(db dbal.Database) anistats_client.UserService {
	return &UserService{
		db: db,
	}
}

func (u UserService) User(ctx context.Context, id v1.UserId) (v1.User, error) {
	userRepository, err := u.db.UserRepository(ctx)
	if err != nil {
		return v1.User{}, err
	}

	return userRepository.GetUser(ctx, id)
}

func (u UserService) Avatar(ctx context.Context, id v1.UserId) (image.Image, error) {
	panic("implement me")
}
