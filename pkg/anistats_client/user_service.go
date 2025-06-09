package anistats_client

import (
	"image"

	v1 "anistats/api/v1"
)

type UserService interface {
	User(id v1.UserId) (*v1.User, error)
	Avatar(id v1.UserId) (image.Image, error)
}
