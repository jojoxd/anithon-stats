package v1

import "encoding/json"

type UserListId string

type UserList struct {
	Id          UserListId   `json:"id"`
	DisplayName Translatable `json:"displayName"`
}

func (l *UserList) MarshalJSON() ([]byte, error) {
	return json.Marshal(l)
}

func (l *UserList) UnmarshalJSON(data []byte) error {
	return json.Unmarshal(data, l)
}

type UpdateListRequest interface{}
