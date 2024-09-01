package activity

import (
	"time"

	"github.com/google/uuid"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/model/user"
)

type Message struct {
	Id         uuid.UUID
	ActivityId uuid.UUID
	Author     user.User
	Message    string
	CreatedAt  time.Time
	UpdatedAt  time.Time
}
