package activity

import (
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/model/activity/event"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/model/list"
)

type List struct {
	Activity

	Type event.List
	List list.List
}
