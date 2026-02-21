package server_api

import (
	"context"
	"image"

	"github.com/google/uuid"

	v1 "anistats/api/v1"
	"anistats/internal/server/dbal"
	"anistats/pkg/anistats_client"
)

var _ anistats_client.UserService = (*UserService)(nil)

type UserService struct {
	userRepository dbal.UserRepository
}

func NewUserService(userRepository dbal.UserRepository) anistats_client.UserService {
	return &UserService{
		userRepository: userRepository,
	}
}

func (svc UserService) User(ctx context.Context, id uuid.UUID) (v1.User, error) {
	return svc.userRepository.GetUser(ctx, id)
}

func (svc UserService) Avatar(ctx context.Context, id uuid.UUID) (image.Image, error) {
	panic("implement me")
}
