package cmd

import (
	"github.com/spf13/cobra"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/config"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/grpc"
)

var serveCmd = &cobra.Command{
	Use: "serve",
	Run: func(cmd *cobra.Command, args []string) {
		cfg := config.NewViper()

		grpc.Serve(cfg)
	},
}

func init() {
	rootCmd.AddCommand(serveCmd)

	flags := serveCmd.PersistentFlags()
	config.BindFullConfigFlags(flags)
}
