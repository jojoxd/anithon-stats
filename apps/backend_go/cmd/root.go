package cmd

import (
	"context"
	"log/slog"
	"time"

	"github.com/spf13/cobra"
)

var timeStart time.Time

var rootCmd = &cobra.Command{
	Use:   "anistats",
	Short: "Anistats server",

	PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
		timeStart = time.Now()

		return initConfiguration(cmd)
	},

	PersistentPostRunE: func(cmd *cobra.Command, args []string) error {
		logger.Debug("done", slog.Duration("duration", time.Since(timeStart)))

		return nil
	},
}

func Execute(ctx context.Context) error {
	return rootCmd.ExecuteContext(ctx)
}

func init() {
	rootCmd.PersistentFlags().StringP("config", "c", "", "Which config to use (default: ./server.yaml and $XDG_CONFIG_HOME/anistats/server.yaml)")
	rootCmd.PersistentFlags().String("database.dsn", "", "Set the database dsn")

	rootCmd.PersistentFlags().String("auth.anilist.clientId", "", "Set the anilist client id to use")
	rootCmd.PersistentFlags().String("auth.anilist.clientSecret", "", "Set the anilist client secret to use")
}
