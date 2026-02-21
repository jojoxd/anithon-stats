package wcag

import (
	"image/color"
)

// Contrast calculates the contrast of 2 colors
// It returns a value between 1 and 21 inclusive, and specifies a ratio N:1
// As an example, when this function returns 12, it means there is a contrast ratio of 12:1
// See https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio
func Contrast(c1, c2 color.NRGBA) float64 {
	return RelativeLuminanceContrast(
		NewRelativeLuminance(c1),
		NewRelativeLuminance(c2),
	)
}

func RelativeLuminanceContrast(rl1, rl2 RelativeLuminance) float64 {
	rl1f, rl2f := float64(rl1), float64(rl2)

	if rl1f < rl2f {
		rl1f, rl2f = rl2f, rl1f
	}

	return (rl1f + 0.05) / (rl2f + 0.05)
}

func IsTextContrasted(c1, c2 color.NRGBA, fontSizePx int) bool {
	dfn := GetDefinition()

	if fontSizePx < dfn.textCutoffLargePx {
		return Contrast(c1, c2) >= GetDefinition().textContrast
	}

	return Contrast(c1, c2) >= GetDefinition().largeTextContrast
}

func IsBoldTextContrasted(c1, c2 color.NRGBA, fontSizePx int) bool {
	dfn := GetDefinition()

	if fontSizePx < dfn.largeTextCutoffPx {
		return Contrast(c1, c2) >= GetDefinition().boldTextContrast
	}

	return Contrast(c1, c2) >= GetDefinition().boldLargeTextContrast
}
