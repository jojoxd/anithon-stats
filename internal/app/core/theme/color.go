package theme

import (
	"fmt"
	"image/color"

	"github.com/bin16/go-hexcolor"
	"gopkg.in/yaml.v3"
)

type Color string

func (c *Color) NRGBA() color.NRGBA {
	return hexcolor.SafeParse(string(*c))
}

func (c *Color) MarshalYAML() (any, error) {
	return yaml.Marshal(string(*c))
}

func (c *Color) UnmarshalYAML(value *yaml.Node) error {
	if value.Tag != "!!str" {
		return fmt.Errorf("should be a !!str, got '%s'", value.Tag)
	}

	*c = Color(value.Value)
	return nil
}
