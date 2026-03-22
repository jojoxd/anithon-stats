package entity

import "database/sql"

type EntryData struct {
	Id               string
	Mult             float64 // todo fix typing to decimal?
	Order            sql.NullInt32
	StartAt          sql.NullInt32
	Split            sql.NullInt32
	SplitSequelEntry bool
}
