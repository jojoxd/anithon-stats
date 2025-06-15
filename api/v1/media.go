package v1

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type MediaId uuid.UUID

func (i MediaId) String() string {
	return uuid.UUID(i).String()
}

type Media struct {
	Id          MediaId        `json:"id"`
	DisplayName Translatable   `json:"displayName"`
	Description string         `json:"description"`
	Episodes    MediaEpisodes  `json:"episodes"`
	Related     MediaRelations `json:"related"`
}

func (m *Media) MarshalJSON() ([]byte, error) {
	return json.Marshal(m)
}

func (m *Media) UnmarshalJSON(data []byte) error {
	return json.Unmarshal(data, m)
}

type MediaEpisodes struct {
	Total    int64         `json:"total"`
	Duration time.Duration `json:"duration"`
}

func (e MediaEpisodes) TotalDuration() time.Duration {
	return time.Duration(e.Total * int64(e.Duration))
}

type MediaRelations struct {
	PrequelIds []MediaId `json:"prequels"`
	SequelIds  []MediaId `json:"sequels"`
}
