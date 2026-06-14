package api

type List struct {
	Id       string       `json:"id"`
	User     User         `json:"user"`
	Settings ListSettings `json:"settings"`
	Metadata ListMetadata `json:"metadata"`
	Entries  EntryList    `json:"entries"`
	Chunks   ChunkList    `json:"chunks"`
	Series   SeriesList   `json:"series"`
}

type ListMetadata struct {
	Title       string            `json:"title"`
	Ref         ListRef           `json:"ref"`
	Description string            `json:"description"`
	Stats       ListMetadataStats `json:"stats"`
}

type ListMetadataStats struct {
	Time int64 `json:"time"`
}

type ListSettings struct {
	StackSize          uint `json:"stackSize"`
	AllowChunkMerge    bool `json:"allowChunkMerge"`
	MaxChunkLength     uint `json:"maxChunkLength"`
	MaxChunkJoinLength uint `json:"maxChunkJoinLength"`
}

type UpdateListRequest struct {
	Id       string       `json:"id"`
	Settings ListSettings `json:"settings"`
	Data     []*EntryData `json:"data"`
	Entries  []*Entry     `json:"entries"`
}

type ListRef struct {
	Id string `json:"id"`
}

func (l List) AsRef() ListRef {
	return ListRef{l.Id}
}

func NewListRef(id string) ListRef {
	return ListRef{id}
}
