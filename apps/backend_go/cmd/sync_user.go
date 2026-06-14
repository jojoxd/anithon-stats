package cmd

import (
	"strconv"

	"github.com/google/uuid"
	"github.com/spf13/cobra"

	"git.jojoxd.nl/projects/anistats/backend/ent"
	"git.jojoxd.nl/projects/anistats/backend/ent/user"
	"git.jojoxd.nl/projects/anistats/backend/internal/anilist"
	"git.jojoxd.nl/projects/anistats/backend/internal/application"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain"
)

var syncUserCmd = &cobra.Command{
	Use:   "user [ userId | anilistId | anilistUserName ]",
	Short: "Synchronize a user",
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		db, err := ent.Open("postgres", configuration.Dbal.Dsn)
		if err != nil {
			return err
		}

		// migrate it
		if err := db.Schema.Create(cmd.Context()); err != nil {
			return err
		}

		al := anilist.NewClient()

		userService := application.NewUserService(db, al)

		seriesDomainService := domain.NewSeriesService()

		syncSeriesService := domain.NewSyncSeriesService(seriesDomainService, logger)

		syncService := application.NewSyncService(
			domain.NewListService(logger),
			seriesDomainService,
			domain.NewEntryService(),
			syncSeriesService,
			logger,
		)

		return db.WithTx(cmd.Context(), func(tx *ent.Tx) error {
			if id, err := uuid.Parse(args[0]); err == nil {
				logger.Info("Synchronizing user by id", "id", id)

				return syncService.SyncUserById(cmd.Context(), tx, id)
			}

			if anilistId, err := strconv.Atoi(args[0]); err == nil {
				if user, err := tx.User.Query().Where(user.AnilistID(uint(anilistId))).Only(cmd.Context()); err == nil {
					logger.Info("Synchronizing user by anilist ID",
						"user.id", user.ID.String(),
						"user.name", user.Name,
					)

					return syncService.SyncUserById(cmd.Context(), tx, user.ID)
				}
			}

			if user, err := tx.User.Query().Where(user.NameEQ(args[0])).Only(cmd.Context()); err == nil {
				logger.Info("Synchronizing user by name", "user.id", user.ID.String(), "user.name", user.Name)

				return syncService.SyncUserById(cmd.Context(), tx, user.ID)
			}

			logger.Info("Could not find user locally, trying to import from anilist")

			if anilistId, err := strconv.Atoi(args[0]); err == nil {
				if aluser, err := al.GetUser(cmd.Context(), uint(anilistId)); err == nil {
					logger.Info("Found user by ID on anilist", "user.name", aluser.Name)

					user, err := userService.CreateByAnilistId(cmd.Context(), uint(aluser.Id))
					if err != nil {
						return err
					}

					return syncService.SyncUserById(cmd.Context(), tx, user.ID)
				}
			}

			if aluser, err := al.GetUserByName(cmd.Context(), args[0]); err == nil {
				logger.Info("Found user by name on anilist", "user.anilistId", aluser.Id)

				user, err := userService.CreateByAnilistId(cmd.Context(), uint(aluser.Id))
				if err != nil {
					return err
				}

				return syncService.SyncUserById(cmd.Context(), tx, user.ID)
			}

			return nil
		})
	},
}

func init() {
	syncCmd.AddCommand(syncUserCmd)
}
