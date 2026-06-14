package api

type Entry struct {
	Id string `json:"id"`
	// Reference to the Series
	SeriesRef          SeriesRef   `json:"series"`
	Episodes           int64       `json:"episodes"`
	HasJoinedLastChunk bool        `json:"hasJoinedLastChunk"`
	Stats              EntryStats  `json:"stats"`
	Progress           int64       `json:"progress"`
	Status             EntryStatus `json:"status"`
	SequelRef          *EntryRef   `json:"sequel"`
	CustomSequelRef    *EntryRef   `json:"customSequel"`
}

// EntryRef references a specific Entry
type EntryRef struct {
	Ref string `json:"ref"`
}

type EntryList struct {
	Items []Entry     `json:"items"`
	Data  []EntryData `json:"data"`
}

type EntryData struct {
	Ref  string  `json:"ref"`
	Mult float64 `json:"mult"`
	// TODO Order should always be initialized as null
	Order            *int  `json:"order"`
	Split            *int  `json:"split"`
	SplitSequelEntry bool  `json:"splitSequelEntry"`
	StartAt          int64 `json:"startAt"`
}

type EntryStats struct {
	Chunks int64 `json:"chunks"`
	Time   int64 `json:"time"`
}

type EntryStatus string

const (
	EntryStatusCompleted EntryStatus = "completed"
	EntryStatusCurrent   EntryStatus = "current"
	EntryStatusDropped   EntryStatus = "dropped"
	EntryStatusPaused    EntryStatus = "paused"
	EntryStatusPlanning  EntryStatus = "planning"
	EntryStatusRepeating EntryStatus = "repeating"
)

func (e EntryStatus) String() string {
	return string(e)
}

func (EntryStatus) Values() []string {
	return []string{
		string(EntryStatusCompleted),
		string(EntryStatusCurrent),
		string(EntryStatusDropped),
		string(EntryStatusPaused),
		string(EntryStatusPlanning),
		string(EntryStatusRepeating),
	}
}

func (e EntryStatus) Valid() bool {
	switch e {
	case EntryStatusCompleted:
		return true
	case EntryStatusCurrent:
		return true
	case EntryStatusDropped:
		return true
	case EntryStatusPaused:
		return true
	case EntryStatusPlanning:
		return true
	case EntryStatusRepeating:
		return true
	}

	return false
}
