package sync

import "git.jojoxd.nl/projects/anistats/backend/api"

type JobUser struct {
	Ref api.UserRef
}

func (s JobUser) ImplementsSyncItem() {}
