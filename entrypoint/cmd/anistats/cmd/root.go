package cmd

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"path"

	"github.com/adrg/xdg"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const binary = "anistats"

var rootCmd = &cobra.Command{
	Use: binary,
}

func Execute() {
	ctx := context.Background()

	if err := rootCmd.ExecuteContext(ctx); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

var configFile = ""

func init() {
	cobra.OnInitialize(initViper)

	rootCmd.PersistentFlags().StringVar(&configFile, "config", "", "config file (default is $XDG_CONFIG_HOME/anistats/config.yaml)")
}

func initViper() {
	if configFile != "" {
		viper.SetConfigFile(configFile)
	} else {
		configPath := path.Join(xdg.ConfigHome, "anistats")
		slog.Default().Info(fmt.Sprintf("configPath: %s", configPath))
		viper.AddConfigPath(configPath)
		viper.SetConfigName("config")
	}

	viper.SetConfigType("yaml")

	if err := viper.ReadInConfig(); err != nil {
		fmt.Println("can't read config:", err)
	}
}
