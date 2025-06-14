package gkasync

import (
	"context"
	"fmt"
	"sync"

	"gioui.org/app"
)

type poolScheduler struct {
	window *app.Window
	config *config
	poolCh chan struct{}
	workCh chan ScheduleFn
	init   sync.Once
}

func NewPoolScheduler(window *app.Window, opts ...Option) Scheduler {
	conf := newDefaultConfig()
	conf.Load(opts...)

	return &poolScheduler{
		window: window,
		config: conf,
		poolCh: make(chan struct{}),
		workCh: make(chan ScheduleFn),
	}
}

func (s *poolScheduler) Schedule(f ScheduleFn) {
	s.init.Do(func() {
		for i := 0; i < s.config.workers; i++ {
			go func() {
				s.config.logger.Debug(fmt.Sprintf("starting worker %d", i))

				for work := range s.workCh {
					if work != nil {
						s.config.logger.Debug(fmt.Sprintf("worker %d: found some work", i))
						s.window.Invalidate()

						work(context.Background())

						s.config.logger.Debug(fmt.Sprintf("worker %d: work complete", i))
						s.window.Invalidate()
					}
				}
			}()
		}
	})

	s.workCh <- f
}
