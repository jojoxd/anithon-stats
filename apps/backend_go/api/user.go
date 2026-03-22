package api

type User struct {
	Id     string `json:"id"`
	Name   string `json:"name"`
	Avatar string `json:"avatar"`

	// todo Stats, like total lists
}

type UserResponse struct {
	User *User `json:"user"`
}

type UserListsResponse struct {
	User User `json:"user"`

	Lists map[string]ListMetadata `json:"lists"`
}

type UserRef struct {
	Id string `json:"id"`
}

func (s User) AsRef() UserRef {
	return UserRef{Id: s.Id}
}

func NewUserRef(id string) *UserRef {
	return &UserRef{Id: id}
}
