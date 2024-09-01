package list

import (
	"time"

	"github.com/google/uuid"
)

type List struct {
	Id uuid.UUID

	UserId uuid.UUID

	Name string

	CreatedAt time.Time
	UpdatedAt time.Time

	Settings
}

type Settings struct {
}

type CreateList struct {
	Name string

	UserId uuid.UUID
}

type UpdateList struct {
	Name string
}
