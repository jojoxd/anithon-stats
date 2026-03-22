package main

import (
	"context"
	"log"
	"os"

	"git.jojoxd.nl/projects/anistats/backend/cmd"
)

func main() {
	ctx := context.Background()

	if err := cmd.Execute(ctx); err != nil {
		log.Fatal(err)
	}

	os.Exit(0)
}
