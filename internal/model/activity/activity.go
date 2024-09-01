package activity

import (
	"os/user"
	"time"

	"github.com/google/uuid"
)

type Activity struct {
	Id        uuid.UUID
	User      user.User
	CreatedAt time.Time
}
