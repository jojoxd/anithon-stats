package anistats_client_http

import (
	"context"
	"image"

	v1 "anistats/api/v1"
	"anistats/pkg/anistats_client"
)

var _ anistats_client.UserService = (*UserService)(nil)

type UserService struct {
	client *HttpClient
}

func NewUserService(client *HttpClient) anistats_client.UserService {
	return &UserService{
		client: client,
	}
}

func (u UserService) User(ctx context.Context, id v1.UserId) (v1.User, error) {
	// TODO implement me
	panic("implement me")
}

func (u UserService) Avatar(ctx context.Context, id v1.UserId) (image.Image, error) {
	// TODO implement me
	panic("implement me")
}
