package fixedpool

import (
	"runtime"

	"anistats/pkg/gio_kit/contract"
	"anistats/pkg/gio_kit/internal"
)

type Option func(c *config)

type config struct {
	workers int
	logger  contract.Logger
}

func newDefaultConfig() *config {
	conf := &config{
		workers: runtime.NumCPU(),
		logger:  internal.NewNilLogger(),
	}

	return conf
}

func (c *config) Load(opts ...Option) {
	for _, opt := range opts {
		opt(c)
	}
}

func Logger(logger contract.Logger) Option {
	return func(c *config) {
		c.logger = internal.NewPrefixLogger("gkasync.fixedPoolScheduler", logger)
	}
}

func Workers(workers int) Option {
	return func(c *config) {
		c.workers = workers
	}
}
