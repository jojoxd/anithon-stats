package colorlib

import (
	"errors"
	"fmt"

	"gopkg.in/yaml.v3"
)

var _ yaml.Marshaler = (*Color)(nil)
var _ yaml.Unmarshaler = (*Color)(nil)

func (c *Color) MarshalYAML() (any, error) {
	value := uint64(c.R)<<32 | uint64(c.G)<<16 | uint64(c.B)<<8 | uint64(c.A)

	return fmt.Sprintf("0x%x", value), nil
}

func (c *Color) UnmarshalYAML(value *yaml.Node) error {
	// TODO
	return errors.New("not implemented")
}
