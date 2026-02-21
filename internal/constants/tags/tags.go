package tags

import "sort"

//go:generate -command TAGS go run generator/main.go -v -runCommand="internal/constants/tags_build/tags.go"
//go:generate TAGS -source=../../../entry/cli

var (
	Tags    []string
	orderer bool
)

func Ordered() []string {
	if !orderer {
		sort.Strings(Tags)
		orderer = true
	}

	return Tags
}
