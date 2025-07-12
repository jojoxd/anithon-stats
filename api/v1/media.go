package v1

import (
	"time"

	"github.com/google/uuid"
)

type Media struct {
	Id          uuid.UUID      `json:"id"`
	DisplayName Translatable   `json:"displayName"`
	Description string         `json:"description"`
	Episodes    MediaEpisodes  `json:"episodes"`
	Related     MediaRelations `json:"related"`
}

type MediaEpisodes struct {
	Total    int64         `json:"total"`
	Duration time.Duration `json:"duration"`
}

func (e MediaEpisodes) TotalDuration() time.Duration {
	return time.Duration(e.Total * int64(e.Duration))
}

type MediaRelations struct {
	PrequelIds []uuid.UUID `json:"prequels"`
	SequelIds  []uuid.UUID `json:"sequels"`
}
