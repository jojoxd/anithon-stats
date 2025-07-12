package v1

import (
	"github.com/google/uuid"
	"golang.org/x/text/language"
)

type Translatable struct {
	Id           uuid.UUID               `json:"id"`
	Translations map[language.Tag]string `json:"translations"`
}

// func (t *Translatable) MarshalJSON() ([]byte, error) {
// 	return json.Marshal(t)
// }
//
// func (t *Translatable) UnmarshalJSON(data []byte) error {
// 	return json.Unmarshal(data, t)
// }
