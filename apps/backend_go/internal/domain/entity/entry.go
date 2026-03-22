package entity

import (
	"database/sql"

	"git.jojoxd.nl/projects/anistats/backend/api"
)

// type Entry interface {
// 	Id() string
// 	AnilistId() string
// 	ListRef() api.ListRef
// 	SeriesRef() api.SeriesRef
// 	Data() EntryData
// 	State() api.EntryStatus
// 	Progress() int64
// 	CustomSequelRef() *api.SeriesRef
// }

type Entry struct {
	Id                   string
	AnilistId            string
	ListId               string
	SeriesId             string
	Data                 EntryData
	State                api.EntryStatus
	Progress             int64
	CustomSequelSeriesId sql.NullString
}
