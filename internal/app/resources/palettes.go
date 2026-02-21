package res

import (
	"embed"
	"io/fs"

	"anistats/internal/app/core/theme"
)

//go:embed palettes/*.yaml
var embedFS embed.FS

func DefaultPalette() (*theme.Palette, error) {
	sub, err := fs.Sub(embedFS, "palettes")
	if err != nil {
		return nil, err
	}

	return theme.LoadPalette("default", sub)
}
