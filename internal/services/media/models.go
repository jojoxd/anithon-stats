package media

import (
	"time"

	"github.com/google/uuid"
)

type Media struct {
	Id            uuid.UUID
	EpisodeTotal  uint32
	EpisodeLength time.Duration
}

type Translation struct {
	MediaId      uuid.UUID
	LanguageCode string
	Translation  string
}

type CreateMedia struct{}

type UpdateMedia struct{}

type SetTranslation struct{}
