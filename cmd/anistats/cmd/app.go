package cmd

import (
	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"anistats/internal/app"
)

var appCmd = &cobra.Command{
	Use:   "app",
	Short: "Run Anistats App",
	Run:   runApp,
}

func init() {
	pfl := appCmd.PersistentFlags()
	pfl.BoolP("fullscreen", "f", false, "Run app fullscreen")
	viper.BindPFlag("app.fullscreen", pfl.Lookup("fullscreen"))

	rootCmd.AddCommand(appCmd)
}

func runApp(cmd *cobra.Command, args []string) {
	app.Main()
}
