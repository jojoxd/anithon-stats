package entity

import (
	"database/sql"
	"time"

	"git.jojoxd.nl/projects/anistats/backend/api"
)

type User struct {
	Id        string
	Username  string
	AvatarUrl sql.NullString
	AnilistId string

	CreatedAt time.Time
	UpdatedAt sql.NullTime
}

func (u User) AsApi() api.User {
	return api.User{
		Id:     u.Id,
		Name:   u.Username,
		Avatar: u.AvatarUrl.String,
	}
}

func (u User) AsRef() api.UserRef {
	return api.UserRef{
		Id: u.Id,
	}
}
