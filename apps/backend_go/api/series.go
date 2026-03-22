package api

type Series struct {
	Id          string      `json:"id"`
	Title       SeriesTitle `json:"title"`
	CoverImage  string      `json:"coverImage"`
	Duration    int64       `json:"duration"`
	Episodes    *int64      `json:"episodes"`
	Description *string     `json:"description"`
	PrequelIds  []string    `json:"prequelIds"`
	SequelIds   []string    `json:"sequelIds"`
}

type SeriesList struct {
	Items []Series `json:"items"`
}

type SeriesTitle struct {
	Romaji  string `json:"romaji"`
	English string `json:"english"`
	Native  string `json:"native"`
}

// todo Id should be named Ref
type SeriesRef struct {
	Id string `json:"ref"`
}

func (s Series) AsRef() SeriesRef {
	return SeriesRef{Id: s.Id}
}

func NewSeriesRef(id string) *SeriesRef {
	return &SeriesRef{Id: id}
}
