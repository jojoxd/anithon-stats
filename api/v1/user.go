package v1

import (
	"fmt"

	"github.com/google/uuid"
)

type UserId uuid.UUID

func (u UserId) String() string {
	return uuid.UUID(u).String()
}

type User struct {
	Id   UserId `json:"id"`
	Name string `json:"name"`
}

func (u User) String() string {
	return fmt.Sprintf("v1.User{Id: %v, Name: %v}", u.Id.String(), u.Name)
}
