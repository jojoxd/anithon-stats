package cmd

import (
	"github.com/spf13/cobra"
)

var syncCmd = &cobra.Command{
	Use:   "sync",
	Short: "Run a sync job",
}

func init() {
	rootCmd.AddCommand(syncCmd)
}
