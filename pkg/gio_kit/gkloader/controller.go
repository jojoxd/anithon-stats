package gkloader

import (
	"context"
	"sync"

	"anistats/pkg/gio_kit/gkasync"
)

type Controller interface {
	State() State
	Load(args ...interface{})
}

type LoaderFn func(ctx context.Context, args ...interface{}) (interface{}, error)

type SchedulerController struct {
	scheduler gkasync.Scheduler
	state     State
	stateMu   sync.RWMutex
	loader    LoaderFn
}

func NewSchedulerController(scheduler gkasync.Scheduler, loader LoaderFn) Controller {
	sc := &SchedulerController{
		scheduler: scheduler,
		loader:    loader,
	}

	sc.stateMu.Lock()
	sc.state = &InitialState{}
	sc.stateMu.Unlock()

	return sc
}

func (sc *SchedulerController) State() State {
	sc.stateMu.RLock()
	defer sc.stateMu.RUnlock()

	return sc.state
}

func (sc *SchedulerController) Load(args ...interface{}) {
	sc.scheduler.Schedule(func(ctx context.Context) {
		sc.stateMu.Lock()
		sc.state = &LoadingState{}
		sc.stateMu.Unlock()

		data, err := sc.loader(ctx, args...)
		if err != nil {
			sc.stateMu.Lock()
			sc.state = &ErrorState{
				Error: err,
			}
			sc.stateMu.Unlock()

			return
		}

		sc.stateMu.Lock()
		sc.state = &LoadedState{
			Data: data,
		}
		sc.stateMu.Unlock()
	})
}
