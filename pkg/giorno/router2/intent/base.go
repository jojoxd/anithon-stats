package intent

import (
	"anistats/pkg/giorno/router2/internal"
)

type Base interface {
	Target() internal.Target
	implementsIntent()
}
