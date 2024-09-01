package list

import (
	"time"

	"github.com/google/uuid"
)

type Entry struct {
	Id      uuid.UUID
	ListId  uuid.UUID
	MediaId uuid.UUID

	CreatedAt time.Time
	UpdatedAt time.Time

	EpisodesWatched uint32

	EntrySettings
}

// ListEntrySettings no data yet
type EntrySettings struct{}
