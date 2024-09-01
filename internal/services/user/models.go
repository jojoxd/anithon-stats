package user

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	Id           uuid.UUID
	Name         string
	PasswordHash string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type CreateUser struct {
	Name         string
	PasswordHash string
}

type UpdateUser struct {
	PasswordHash string
}
