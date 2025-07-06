package main

import (
	"anistats/cmd/anistats/cmd"

	_ "anistats/internal/logging"
)

func main() {
	cmd.Execute()
}
