package media

import (
	"github.com/google/uuid"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/model/source"
)

type Media struct {
	Id             uuid.UUID
	Translations   []*MediaTranslation
	ExternalIdents []*source.Source
}
