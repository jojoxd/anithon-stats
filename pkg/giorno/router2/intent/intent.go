package intent

import (
	"anistats/pkg/giorno/router2/internal"
)

type Intent struct {
	target internal.Target
}

func New(target internal.Target) Intent {
	return Intent{
		target: target,
	}
}

func (i Intent) Target() internal.Target {
	return i.target
}

func (i Intent) implementsIntent() {}
