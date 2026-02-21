package wcag

import (
	"image/color"
	"math"
	"testing"
)

var luminanceTests = map[string]struct {
	color             color.NRGBA
	expectedLuminance float64
	delta             float64
}{
	"#000000FF": {
		color:             color.NRGBA{R: 0x00, G: 0x00, B: 0x00, A: 0xFF},
		expectedLuminance: 0,
		delta:             math.SmallestNonzeroFloat64,
	},
	"#FFFFFFFF": {
		color:             color.NRGBA{R: 0xFF, G: 0xFF, B: 0xFF, A: 0xFF},
		expectedLuminance: 1,
		delta:             math.SmallestNonzeroFloat64,
	},
	"#888888FF": {
		color:             color.NRGBA{R: 0x88, G: 0x88, B: 0x88, A: 0xFF},
		expectedLuminance: 0.22,
		delta:             0.1,
	},
	"#00FF00FF": {
		color:             color.NRGBA{R: 0x00, G: 0xFF, B: 0x00, A: 0xFF},
		expectedLuminance: 0.71,
		delta:             0.1,
	},
	"#FF00FFFF": {
		color:             color.NRGBA{R: 0xFF, G: 0x00, B: 0xFF, A: 0xFF},
		expectedLuminance: 0.28,
		delta:             0.1,
	},
}

func TestRelativeLuminance(t *testing.T) {
	t.Parallel()

	for name, tt := range luminanceTests {
		t.Run(name, func(t *testing.T) {
			actual := NewRelativeLuminance(tt.color)

			if math.Abs(float64(actual)-tt.expectedLuminance) > tt.delta {
				t.Errorf("Expected %f to match %f with a delta of %f", actual, tt.expectedLuminance, tt.delta)
			}
		})
	}
}
