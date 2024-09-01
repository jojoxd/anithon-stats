package user

import (
	"github.com/google/uuid"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/model/source"
)

type User struct {
	Id             uuid.UUID
	Name           string
	PasswordHash   string
	ExternalIdents []*source.Source
}
