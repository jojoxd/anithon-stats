package activity

import (
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/model/activity/event"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/model/list"
)

type ListEntry struct {
	Activity

	Type      event.ListEntry
	ListEntry list.Entry
}
