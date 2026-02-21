package main

import (
	"fmt"

	"anistats/entry/cli/cmd"
	"anistats/internal/constants"
	_ "anistats/internal/logging"
)

func main() {
	fmt.Printf("%s %s\n", constants.AppName, constants.Version())

	cmd.Execute()
}
