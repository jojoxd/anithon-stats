package gkasync

import (
	"context"
	"fmt"
	"sync"

	"gioui.org/app"
)

type poolScheduler struct {
	window     *app.Window
	maxWorkers int
	poolCh     chan struct{}
	workCh     chan ScheduleFn
	init       sync.Once
}

func NewPoolScheduler(window *app.Window, maxWorkers int) Scheduler {
	return &poolScheduler{
		window:     window,
		maxWorkers: maxWorkers,
		poolCh:     make(chan struct{}),
		workCh:     make(chan ScheduleFn),
	}
}

func (s *poolScheduler) Schedule(f ScheduleFn) {
	s.init.Do(func() {
		for i := 0; i < s.maxWorkers; i++ {
			go func() {
				fmt.Printf("gkasync.go: starting worker %d\n", i)

				for work := range s.workCh {
					if work != nil {
						fmt.Printf("gkasync.go: found some work\n")
						s.window.Invalidate()
						work(context.Background())

						fmt.Printf("gkasync.go: work done\n")
						s.window.Invalidate()
					}
				}
			}()
		}
	})

	s.workCh <- f
}
