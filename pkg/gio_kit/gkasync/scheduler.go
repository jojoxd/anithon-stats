package gkasync

import (
	"context"
)

type ScheduleFn func(ctx context.Context)

type Scheduler interface {
	Schedule(ScheduleFn)
}
