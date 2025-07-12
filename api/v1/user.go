package v1

import (
	"fmt"

	"github.com/google/uuid"
)

type User struct {
	Id   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}

func (u User) String() string {
	return fmt.Sprintf("v1.User{Id: %v, Name: %v}", u.Id.String(), u.Name)
}
