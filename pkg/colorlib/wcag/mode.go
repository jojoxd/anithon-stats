package wcag

type Specification int16

const (
	// Specification_22_AA is WCAG 2.2 AA
	Specification_22_AA Specification = 22_2

	// Specification_22_AAA is WCAG 2.2 AAA
	Specification_22_AAA Specification = 22_3
)

var specification = Specification_22_AAA

func SetSpecification(newSpecification Specification) {
	specification = newSpecification
}

func GetSpecification() Specification {
	return specification
}

type Definition struct {
	textContrast      float64
	largeTextContrast float64

	boldTextContrast      float64
	boldLargeTextContrast float64

	textCutoffLargePx int
	largeTextCutoffPx int
}

var definitions = map[Specification]Definition{
	// See https://www.w3.org/WAI/WCAG22/quickref/#contrast-minimum
	Specification_22_AA: {
		textContrast:     4.5,
		boldTextContrast: 4.5,

		largeTextContrast:     3.0,
		boldLargeTextContrast: 3.0,

		textCutoffLargePx: 18,
		largeTextCutoffPx: 14,
	},

	// See https://www.w3.org/WAI/WCAG22/quickref/#contrast-enhanced
	Specification_22_AAA: {
		textContrast:     7.0,
		boldTextContrast: 7.0,

		largeTextContrast:     4.5,
		boldLargeTextContrast: 4.5,

		textCutoffLargePx: 18,
		largeTextCutoffPx: 14,
	},
}

func GetDefinition() Definition {
	return definitions[specification]
}
