package cmd

import (
	"github.com/spf13/cobra"

	"git.jojoxd.nl/projects/anistats/backend/internal/dbal"
)

var migrateCmd = &cobra.Command{
	Use:   "migrate",
	Short: "Migrate",
	RunE: func(cmd *cobra.Command, args []string) error {
		database, err := dbal.New(configuration.Dbal, logger)
		if err != nil {
			return err
		}

		defer database.Close()

		return database.Migrate(cmd.Context())
	},
}

func init() {
	// todo: options

	rootCmd.AddCommand(migrateCmd)
}
