package api

type Chunk struct {
	RootEntryRef string     `json:"rootEntry"`
	EntryRef     string     `json:"entry"`
	Start        int64      `json:"start"`
	End          int64      `json:"end"`
	IsJoined     bool       `json:"isJoined"`
	State        ChunkState `json:"state"`
	Progress     int64      `json:"progress"`
}

type ChunkList struct {
	Items []Chunk
}

type ChunkState string

const (
	ChunkStateNotStarted ChunkState = "not-started"
	ChunkStateStarted    ChunkState = "started"
	ChunkStateComplete   ChunkState = "complete"
	ChunkStateDropped    ChunkState = "dropped"
)
