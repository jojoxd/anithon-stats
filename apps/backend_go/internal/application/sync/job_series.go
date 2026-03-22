package sync

import "git.jojoxd.nl/projects/anistats/backend/api"

type JobSeries struct {
	Ref api.SeriesRef
}

func (s JobSeries) ImplementsSyncItem() {}
