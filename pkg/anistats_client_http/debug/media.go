package debug

import (
	"time"

	"github.com/google/uuid"
	"golang.org/x/text/language"

	v1 "anistats/api/v1"
	res "anistats/internal/app/resources"
)

var Media = v1.Media{
	Id: uuid.UUID{},
	DisplayName: v1.Translatable{
		Id: uuid.UUID{},
		Translations: map[language.Tag]string{
			res.LocaleEnglish.Tag(): "Debug DisplayName English",
		},
	},
	Description: "Debug Description",
	Episodes: v1.MediaEpisodes{
		Total:    10,
		Duration: 24 * time.Minute,
	},
	Related: v1.MediaRelations{
		PrequelIds: make([]uuid.UUID, 0),
		SequelIds:  make([]uuid.UUID, 0),
	},
}
