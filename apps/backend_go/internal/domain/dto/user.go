package dto

import "database/sql"

type CreateUser struct {
	Username  string
	AnilistId string

	AvatarUrl sql.NullString
}
