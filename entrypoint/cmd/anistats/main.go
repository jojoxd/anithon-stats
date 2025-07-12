package main

import (
	"fmt"

	"anistats/entrypoint/cmd/anistats/cmd"
	"anistats/internal/constants"
	_ "anistats/internal/logging"
)

func main() {
	fmt.Printf("%s %s\n", constants.AppName, constants.Version())

	cmd.Execute()
}
