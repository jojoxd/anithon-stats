package activity

import (
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/model/activity/event"
)

type User struct {
	Activity

	Type event.User
}
