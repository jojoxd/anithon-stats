package cmd

import (
	"log"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"anistats/internal/app"
	"anistats/internal/config"
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
	cfg, err := config.NewViper(viper.GetViper())
	if err != nil {
		log.Fatal(err)
	}

	app.Main(&cfg.App)
}
