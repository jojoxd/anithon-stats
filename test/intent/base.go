package intent

import (
	"anistats/test/internal"
)

type Base interface {
	Target() internal.Target
	implementsIntent()
}
