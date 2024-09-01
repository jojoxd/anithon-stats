package source

type Type string

var (
	Anilist     Type = "anilist"
	AniDB            = "anidb"
	MyAnimeList      = "mal"
)

type Source struct {
	Type Type
	Id   string
}
