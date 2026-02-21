package theme

import (
	"fmt"
	"io/fs"

	"gopkg.in/yaml.v3"
)

type Palette struct {
	Surface   Color `yaml:"surface,omitempty"`
	OnSurface Color `yaml:"on-surface,omitempty"`

	Primary   Color `yaml:"primary,omitempty"`
	OnPrimary Color `yaml:"on-primary,omitempty"`

	Secondary   Color `yaml:"secondary,omitempty"`
	OnSecondary Color `yaml:"on-secondary,omitempty"`
}

func LoadPalette(name string, fs fs.FS) (*Palette, error) {
	f, err := fs.Open(fmt.Sprintf("%s.yaml", name))
	if err != nil {
		return nil, err
	}

	defer f.Close()

	var st = new(Palette)

	dec := yaml.NewDecoder(f)
	if err := dec.Decode(st); err != nil {
		return nil, err
	}

	return st, nil
}

func (p Palette) Apply(th *Theme) {
	th.material.Fg = p.OnSurface.NRGBA()
	th.material.Bg = p.Surface.NRGBA()

	th.material.ContrastFg = p.Primary.NRGBA()
	th.material.ContrastBg = p.OnPrimary.NRGBA()

	th.surface = p.Surface.NRGBA()
	th.onSurface = p.OnSurface.NRGBA()

	th.primary = p.Primary.NRGBA()
	th.onPrimary = p.OnPrimary.NRGBA()

	th.secondary = p.Secondary.NRGBA()
	th.onSecondary = p.OnSecondary.NRGBA()
}
