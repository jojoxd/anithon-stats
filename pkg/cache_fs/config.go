package cache_fs

import (
	"fmt"
	"os"
)

type config struct {
	directory    string
	stripSlashes bool
}

func newConfig(opts ...Option) (*config, error) {
	config := &config{
		directory:    "",
		stripSlashes: false,
	}

	config.load(opts...)

	// use a temp directory if no directory was set
	if config.directory == "" {
		// TODO: Dynamic pattern based on os.Args[0]
		pattern := fmt.Sprintf("%s-cache", "anistats")
		directory, err := os.MkdirTemp("", pattern)
		if err != nil {
			return nil, err
		}

		config.directory = directory
	}

	return config, nil
}

func (o *config) load(opts ...Option) {
	for _, opt := range opts {
		opt(o)
	}
}

type Option func(*config)

func WithDirectory(directory string) Option {
	return func(o *config) {
		o.directory = directory
	}
}

func WithStripSlashes() Option {
	return func(o *config) {
		o.stripSlashes = true
	}
}
