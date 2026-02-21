package wcag

import (
	"fmt"
	"image/color"
	"math"
	"testing"

	"anistats/pkg/colorlib"
)

var contrastTests = map[string]struct {
	c1, c2 color.NRGBA

	contrast      float64
	contrastDelta float64

	fontSizes               []int
	textContrasted22AA      []bool
	textContrasted22AAA     []bool
	boldTextContrasted22AA  []bool
	boldTextContrasted22AAA []bool
}{
	"black+white": {
		c1: color.NRGBA{R: 0x00, G: 0x00, B: 0x00, A: 0xFF},
		c2: color.NRGBA{R: 0xFF, G: 0xFF, B: 0xFF, A: 0xFF},

		fontSizes:               []int{10, 14, 18, 20, 26},
		textContrasted22AA:      []bool{true, true, true, true, true},
		textContrasted22AAA:     []bool{true, true, true, true, true},
		boldTextContrasted22AA:  []bool{true, true, true, true, true},
		boldTextContrasted22AAA: []bool{true, true, true, true, true},

		contrast:      21.0,
		contrastDelta: math.SmallestNonzeroFloat64,
	},

	"white+black": {
		c1: color.NRGBA{R: 0xFF, G: 0xFF, B: 0xFF, A: 0xFF},
		c2: color.NRGBA{R: 0x00, G: 0x00, B: 0x00, A: 0xFF},

		fontSizes:               []int{10, 14, 18, 20, 26},
		textContrasted22AA:      []bool{true, true, true, true, true},
		textContrasted22AAA:     []bool{true, true, true, true, true},
		boldTextContrasted22AA:  []bool{true, true, true, true, true},
		boldTextContrasted22AAA: []bool{true, true, true, true, true},

		contrast:      21.0,
		contrastDelta: math.SmallestNonzeroFloat64,
	},

	"black+black": {
		c1: color.NRGBA{R: 0x00, G: 0x00, B: 0x00, A: 0xFF},
		c2: color.NRGBA{R: 0x00, G: 0x00, B: 0x00, A: 0xFF},

		fontSizes:               []int{10, 14, 18, 20, 26},
		textContrasted22AA:      []bool{false, false, false, false, false},
		textContrasted22AAA:     []bool{false, false, false, false, false},
		boldTextContrasted22AA:  []bool{false, false, false, false, false},
		boldTextContrasted22AAA: []bool{false, false, false, false, false},

		contrast:      1.0,
		contrastDelta: math.SmallestNonzeroFloat64,
	},
}

func TestContrast(t *testing.T) {
	t.Parallel()

	for name, tt := range contrastTests {
		t.Run(name, func(t *testing.T) {
			actual := Contrast(tt.c1, tt.c2)

			if math.Abs(actual-tt.contrast) > tt.contrastDelta {
				t.Errorf("contrast calculation incorrect: expected %f ~%f, got %f", tt.contrast, tt.contrastDelta, actual)
			}
		})
	}
}

func TestTextContrast_22_AA(t *testing.T) {
	t.Parallel()

	SetSpecification(Specification_22_AA)

	for name, tt := range contrastTests {
		for idx, fontSize := range tt.fontSizes {
			t.Run(fmt.Sprintf("%s@%dpx", name, fontSize), func(t *testing.T) {
				actual := IsTextContrasted(tt.c1, tt.c2, fontSize)

				if actual != tt.textContrasted22AA[idx] {
					c1, _ := colorlib.NewNRGBA(tt.c1)
					c2, _ := colorlib.NewNRGBA(tt.c2)

					t.Errorf("%08X/%08X is not text contrasting (WCAG 2.2/AA)", c1.Uint32(), c2.Uint32())
				}
			})

			t.Run(fmt.Sprintf("%s@%dpx/bold", name, fontSize), func(t *testing.T) {
				actual := IsBoldTextContrasted(tt.c1, tt.c2, fontSize)

				if actual != tt.boldTextContrasted22AA[idx] {
					c1, _ := colorlib.NewNRGBA(tt.c1)
					c2, _ := colorlib.NewNRGBA(tt.c2)

					t.Errorf("%08X/%08X is not text contrasting (WCAG 2.2/AA)", c1.Uint32(), c2.Uint32())
				}
			})
		}
	}
}

func TestTextContrast_22_AAA(t *testing.T) {
	t.Parallel()

	SetSpecification(Specification_22_AAA)

	for name, tt := range contrastTests {
		for idx, fontSize := range tt.fontSizes {
			t.Run(fmt.Sprintf("%s@%dpx", name, fontSize), func(t *testing.T) {
				actual := IsTextContrasted(tt.c1, tt.c2, fontSize)

				if actual != tt.textContrasted22AAA[idx] {
					c1, _ := colorlib.NewNRGBA(tt.c1)
					c2, _ := colorlib.NewNRGBA(tt.c2)

					t.Errorf("%08X/%08X is not text contrasting (WCAG 2.2/AAA)", c1.Uint32(), c2.Uint32())
				}
			})

			t.Run(fmt.Sprintf("%s@%dpx/bold", name, fontSize), func(t *testing.T) {
				actual := IsBoldTextContrasted(tt.c1, tt.c2, fontSize)

				if actual != tt.boldTextContrasted22AAA[idx] {
					c1, _ := colorlib.NewNRGBA(tt.c1)
					c2, _ := colorlib.NewNRGBA(tt.c2)

					t.Errorf("%08X/%08X is not text contrasting (WCAG 2.2/AA)", c1.Uint32(), c2.Uint32())
				}
			})
		}
	}
}
