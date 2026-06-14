package cmd

import (
	"fmt"

	"github.com/spf13/cobra"

	_ "github.com/lib/pq"

	"git.jojoxd.nl/projects/anistats/backend/ent"
)

var syncListCmd = &cobra.Command{
	Use:   "list [listId]",
	Short: "Synchronize a userlist",
	RunE: func(cmd *cobra.Command, args []string) error {
		client, err := ent.Open("postgres", configuration.Dbal.Dsn)
		if err != nil {
			return err
		}

		if err := client.Schema.Create(cmd.Context()); err != nil {
			return err
		}

		var user *ent.User
		err = client.WithTx(cmd.Context(), func(tx *ent.Tx) error {
			user, err = tx.User.Create().
				SetName("jojoxd").
				SetAnilistID(141428).
				SetAvatarURL("https://s4.anilist.co/file/anilistcdn/user/avatar/large/b141428-e3ZauYztX2tf.gif").
				Save(cmd.Context())

			return err
		})

		if err != nil {
			return err
		}

		lists, err := user.QueryLists().All(cmd.Context())
		if err != nil {
			return err
		}

		logger.Info("Created user", "user", user, "lists", lists)

		return fmt.Errorf("not implemented")
	},
}

func init() {
	syncCmd.AddCommand(syncListCmd)
}
