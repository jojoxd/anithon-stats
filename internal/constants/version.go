package constants

import (
	"fmt"
	"strings"

	"anistats/internal/constants/tags"
)

const na = "N/A"

const gitTag = na
const gitCommit = na

func Version() string {
	postfix := strings.Builder{}
	if AppDebug {
		postfix.WriteString("-debug")
	}

	tags := strings.Join(tags.Tags, ",")

	if gitTag != na {
		return fmt.Sprintf("%s%s (%s %s)", gitTag, postfix.String(), gitCommit, tags)
	}

	return fmt.Sprintf("%s%s (%s)", gitCommit, postfix.String(), tags)
}
