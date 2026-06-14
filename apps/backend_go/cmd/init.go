package cmd

import (
	"git.jojoxd.nl/projects/aslog"
	"github.com/spf13/cobra"

	"git.jojoxd.nl/projects/anistats/backend/internal/config"
)

var logger = aslog.NewLogger()
var configuration *config.Config

func initConfiguration(cmd *cobra.Command) error {

	configFile, err := cmd.Flags().GetString("config")
	if err != nil {
		return err
	}

	cfg, err := config.Unmarshal(configFile, cmd.Flags())
	if err != nil {
		return err
	}

	configuration = cfg
	return nil
}
