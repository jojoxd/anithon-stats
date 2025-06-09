package v1

import "encoding/json"

type ListId string

type List struct {
	Id          ListId       `json:"id"`
	DisplayName Translatable `json:"displayName"`
}

func (l *List) MarshalJSON() ([]byte, error) {
	return json.Marshal(l)
}

func (l *List) UnmarshalJSON(data []byte) error {
	return json.Unmarshal(data, l)
}

type UpdateListRequest interface{}
