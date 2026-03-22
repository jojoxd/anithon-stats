package cmd

import (
	"fmt"
	"runtime"

	"github.com/spf13/cobra"

	"git.jojoxd.nl/projects/anistats/backend/server"
)

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Serve",
	RunE: func(cmd *cobra.Command, args []string) error {
		return server.Serve(cmd.Context(), logger, configuration)
	},
}

func init() {
	serveCmd.PersistentFlags().String("server.host", "", "Listen host (default: localhost)")
	serveCmd.PersistentFlags().Int16("server.port", 0, "Listen port (default: 8083)")
	serveCmd.PersistentFlags().String("server.publicUrl", "", "Public url (default: http://localhost:8083)")

	serveCmd.PersistentFlags().Int("sync.workers", 0, fmt.Sprintf("Number of goroutines to use for syncing (default: %d)", runtime.GOMAXPROCS(0)))

	rootCmd.AddCommand(serveCmd)
}
