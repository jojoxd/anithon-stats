package intent

import (
	"anistats/pkg/gio_kit/gkrouter2/internal"
)

type Base interface {
	Target() internal.Target
	implementsIntent()
}
