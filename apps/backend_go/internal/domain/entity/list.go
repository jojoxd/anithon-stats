package entity

import "git.jojoxd.nl/projects/anistats/backend/api"

type List struct {
	Id         string
	Name       string
	UserId     string
	SettingsId string
	MetadataId string
	Entries    []any
	Chunks     []any
}

func (l List) UserRef() api.UserRef {
	return api.UserRef{Id: l.UserId}
}

func (l List) AsApi() api.List {
	return api.List{
		Id:       l.Id,
		User:     api.User{},
		Settings: api.ListSettings{},
		Metadata: api.ListMetadata{},
		Entries:  api.EntryList{},
		Chunks:   api.ChunkList{},
		Series:   api.SeriesList{},
	}
}

func (l List) AsRef() api.ListRef {
	return api.ListRef{Id: l.Id}
}
