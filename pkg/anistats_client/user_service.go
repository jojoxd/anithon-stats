package anistats_client

import (
	"context"
	"image"

	v1 "anistats/api/v1"
)

type UserService interface {
	User(ctx context.Context, id v1.UserId) (v1.User, error)
	Avatar(ctx context.Context, id v1.UserId) (image.Image, error)
}
