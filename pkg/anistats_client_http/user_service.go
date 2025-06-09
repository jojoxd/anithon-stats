package anistats_client_http

import (
	"image"

	v1 "anistats/api/v1"
	"anistats/pkg/anistats_client"
)

var _ anistats_client.UserService = (*UserService)(nil)

type UserService struct {
	client *HttpClient
}

func NewUserService(client *HttpClient) anistats_client.UserService {
	return &UserService{client: client}
}

func (u UserService) User(id v1.UserId) (*v1.User, error) {
	// TODO implement me
	panic("implement me")
}

func (u UserService) Avatar(id v1.UserId) (image.Image, error) {
	// TODO implement me
	panic("implement me")
}
