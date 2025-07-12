package cmd

import (
	"log"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"anistats/internal/server"
)

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Run Anistats server",
	Run:   runServe,
}

func init() {
	pfl := serveCmd.PersistentFlags()
	pfl.StringP("host", "", "0.0.0.0", "Server Host")
	viper.BindPFlag("server.host", pfl.Lookup("host"))

	pfl.Int16P("port", "p", 8080, "Server Port")
	viper.BindPFlag("server.port", pfl.Lookup("port"))

	rootCmd.AddCommand(serveCmd)
}

func runServe(cmd *cobra.Command, args []string) {
	ctx := cmd.Context()

	srv, err := server.New()
	if err != nil {
		log.Fatal(err)
	}

	if err := srv.Database().Migrate(ctx); err != nil {
		log.Fatal(err)
	}

	if err := srv.Serve(ctx); err != nil {
		log.Fatal(err)
	}
}
