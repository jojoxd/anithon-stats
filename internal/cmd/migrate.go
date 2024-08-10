package cmd

import (
	"github.com/spf13/cobra"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/config"
)

var migrateCmd = &cobra.Command{
	Use: "migrate",
	Run: func(cmd *cobra.Command, args []string) {
		cfg := config.NewViper()

		println("Migrate command %s", cfg.Database.Dsn)
	},
}

func init() {
	rootCmd.AddCommand(migrateCmd)

	flags := migrateCmd.PersistentFlags()
	config.BindDatabaseConfigFlags(flags)
}
