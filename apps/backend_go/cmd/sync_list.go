package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

var syncListCmd = &cobra.Command{
	Use:   "list [listId]",
	Short: "Synchronize a userlist",
	RunE: func(cmd *cobra.Command, args []string) error {
		return fmt.Errorf("not implemented")
	},
}

func init() {
	syncCmd.AddCommand(syncListCmd)
}
