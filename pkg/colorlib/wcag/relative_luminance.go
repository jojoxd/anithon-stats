package wcag

import (
	"image/color"
	"math"
)

// RelativeLuminance is a WCAG 2.2 compliant representation of a luminance that is relative to other RelativeLuminance\s
// Please refer to the specification at https://www.w3.org/TR/WCAG22/#dfn-relative-luminance for more information
type RelativeLuminance float64

// NewRelativeLuminance creates a RelativeLuminance according to the WCAG 2.2 specification.
func NewRelativeLuminance(c color.NRGBA) RelativeLuminance {
	red := 0.2126 * rlNormalizeChannel(float64(c.R)/255)
	green := 0.7152 * rlNormalizeChannel(float64(c.G)/255)
	blue := 0.0722 * rlNormalizeChannel(float64(c.B)/255)

	return RelativeLuminance(red + green + blue)
}

// rlNormalizeChannel normalizes a color channel for usage in relative luminance calculations
func rlNormalizeChannel(ch float64) float64 {
	if ch < 0.04045 {
		return ch / 12.92
	}

	return math.Pow((ch+0.055)/1.055, 2.4)
}
