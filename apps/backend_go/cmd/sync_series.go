package cmd

import (
	"errors"

	"github.com/spf13/cobra"

	"git.jojoxd.nl/projects/anistats/backend/internal/application"
	"git.jojoxd.nl/projects/anistats/backend/internal/dbal"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain"
)

var syncSeriesCmd = &cobra.Command{
	Use:   "series [seriesId]",
	Short: "Synchronize a series",
	RunE: func(cmd *cobra.Command, args []string) error {
		database, err := dbal.New(configuration.Dbal, logger)
		if err != nil {
			return err
		}

		if err := database.Open(cmd.Context()); err != nil {
			return err
		}

		defer database.Close()

		syncUserService := domain.NewSyncUserService(database.UserRepository(), logger)
		syncListService := domain.NewSyncListService(
			database.ListRepository(),
			database.ListSettingsRepository(),
			logger,
		)

		translationService := domain.NewTranslationService(
			database.TranslationRepository(),
			logger,
		)

		seriesService := domain.NewSeriesService(
			database.SeriesRepository(),
			translationService,
			logger,
		)

		syncSeriesService := domain.NewSyncSeriesService(
			database.SeriesRepository(),
			seriesService,
			translationService,
			logger,
		)

		syncEntryService := domain.NewSyncEntryService(
			database.EntryRepository(),
			database.EntryDataRepository(),
			database.SeriesRepository(),
			logger,
		)

		syncService := application.NewSyncService(
			configuration.Sync,
			database,
			database.UserRepository(),
			database.ListRepository(),
			database.ListSettingsRepository(),
			syncUserService,
			syncListService,
			syncSeriesService,
			syncEntryService,
			logger,
		)

		tx, err := database.NewTransaction(cmd.Context())
		if err != nil {
			return err
		}

		if err := syncService.SyncSeriesImmediate(cmd.Context(), args[0], tx); err != nil {
			if txerr := tx.Rollback(); txerr != nil {
				return errors.Join(txerr, err)
			}

			return err
		}

		return nil
	},
}

func init() {
	syncCmd.AddCommand(syncSeriesCmd)
}
