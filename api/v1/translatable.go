package v1

import (
	"git.jojoxd.nl/projects/go-giorno/localizer/locale"
	"github.com/google/uuid"
	"golang.org/x/text/language"
)

type Translatable struct {
	Id           uuid.UUID               `json:"id"`
	Translations map[language.Tag]string `json:"translations"`
}

func (t Translatable) Localize(locale locale.Locale) (string, bool) {
	text, ok := t.Translations[language.Tag(locale)]
	return text, ok
}
