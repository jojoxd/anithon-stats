package anistats_client

import (
	"context"
	"image"

	"github.com/google/uuid"

	v1 "anistats/api/v1"
)

type UserService interface {
	User(ctx context.Context, id uuid.UUID) (v1.User, error)
	Avatar(ctx context.Context, id uuid.UUID) (image.Image, error)
}
