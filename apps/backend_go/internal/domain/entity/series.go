package entity

import (
	"database/sql"
	"time"

	"git.jojoxd.nl/projects/anistats/backend/api"
)

type Series struct {
	Id                 string
	TitleTranslationId string
	CoverImageUrl      string
	CreatedAt          time.Time
	SynchronizedAt     sql.NullTime
	Episodes           int64
	Description        string
	Duration           time.Duration
	PrequelIds         []string
	SequelIds          []string
}

func (s Series) AsApi() api.Series {
	return api.Series{
		Id: s.Id,
		Title: api.SeriesTitle{
			Romaji:  "Test ROM",
			English: "Test ENG",
			Native:  "Test NTV",
		},
		CoverImage:  s.CoverImageUrl,
		Duration:    0,
		Episodes:    &s.Episodes,
		Description: &s.Description,
		PrequelIds:  s.PrequelIds,
		SequelIds:   s.SequelIds,
	}
}

func (s Series) AsRef() api.SeriesRef {
	return api.SeriesRef{Id: s.Id}
}
