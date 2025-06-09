package core_impl

import (
	"io"

	"gopkg.in/yaml.v3"

	"anistats/internal/app/core"
)

type RuntimeConfig struct {
	client   *RuntimeClientConfig
	updateCh chan core.RuntimeConfigEvent
}

func NewRuntimeConfig() core.RuntimeConfig {
	return &RuntimeConfig{
		client:   nil,
		updateCh: make(chan core.RuntimeConfigEvent),
	}
}

func (c *RuntimeConfig) Event() <-chan core.RuntimeConfigEvent {
	return c.updateCh
}

func (c *RuntimeConfig) Client() core.RuntimeClientConfig {
	return c.client
}

func (c *RuntimeConfig) Load(r io.Reader) error {
	bytes, err := io.ReadAll(r)
	if err != nil {
		return err
	}

	if err = yaml.Unmarshal(bytes, c); err != nil {
		return err
	}

	return nil
}

func (c *RuntimeConfig) Save(writer io.Writer) error {
	bytes, err := yaml.Marshal(c)
	if err != nil {
		return err
	}

	_, err = writer.Write(bytes)
	return err
}

func (c *RuntimeConfig) Validate() error {
	return nil
}

type RuntimeClientConfig struct{}

func (c *RuntimeClientConfig) ClientType() string {
	return "embedded"
}
