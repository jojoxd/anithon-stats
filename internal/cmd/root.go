package cmd

import (
	"log"
	"os"
	"strings"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/version"
)

var rootCmd = &cobra.Command{
	Use:     "anistats",
	Short:   "ASDF",
	Version: version.BuildVersion(),
}

func Execute() {
	initViper()

	err := rootCmd.Execute()
	if err != nil {
		log.Fatalln(err)
	}
}

func init() {
	flags := rootCmd.PersistentFlags()

	flags.BoolP("verbose", "v", false, "Set verbose logging")
	viper.BindPFlag("log.verbose", flags.Lookup("verbose"))
}

func initViper() {
	// Portable config
	viper.AddConfigPath(".")

	// Global config
	viper.AddConfigPath("/etc/anistats")

	if _, exists := os.LookupEnv("XDG_CONFIG_HOME"); exists {
		viper.AddConfigPath("$XDG_CONFIG_HOME/anistats")
	} else {
		viper.AddConfigPath("$HOME/.config/anistats")
	}

	viper.SetConfigName("anistats")

	viper.SetEnvPrefix("ANISTATS")

	viper.EnvKeyReplacer(strings.NewReplacer("-", "_", ".", "_"))

	viper.AutomaticEnv()
	viper.ReadInConfig()
}
