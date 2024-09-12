package version

import (
	"fmt"
	"time"
)

var (
	Version     = "dev"
	CommitHash  = "n/a"
	CompileDate = ""
)

//goland:noinspection GoBoolExpressions compileDate is filled using LDFLAGS
func BuildVersion() string {
	var compileDate = CompileDate
	if len(compileDate) == 0 {
		compileDate = time.Now().String()
	}

	return fmt.Sprintf("%s-%s (%s)", Version, CommitHash, CompileDate)
}
