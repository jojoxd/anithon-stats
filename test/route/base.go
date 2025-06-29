package route

import (
	"anistats/test/intent"
	"anistats/test/internal"
	"anistats/test/view"
)

type Base interface {
	Target() internal.Target

	Create() view.View
	ApplyIntent(it intent.Base, view view.View)
}
