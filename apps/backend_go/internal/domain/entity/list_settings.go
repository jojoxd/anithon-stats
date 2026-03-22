package entity

type ListSettings struct {
	Id                 string
	StackSize          int
	AllowChunkMerge    bool
	MaxChunkLength     int
	MaxChunkJoinLength int
}
