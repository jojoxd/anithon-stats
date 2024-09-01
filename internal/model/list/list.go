package list

import (
	"time"

	"github.com/google/uuid"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/model/source"
)

type List struct {
	Id      uuid.UUID
	UserId  uuid.UUID
	Name    string
	Entries []*Entry

	Source source.Source

	CreatedAt time.Time
	UpdatedAt time.Time

	ListSettings
}

// ListSettings no data yet
type ListSettings struct{}
