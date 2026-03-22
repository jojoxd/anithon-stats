package server

import (
	"context"
	"net/http"

	"git.jojoxd.nl/projects/anistats/backend/internal/application"
	"git.jojoxd.nl/projects/anistats/backend/internal/config"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/dbal"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"
	"git.jojoxd.nl/projects/anistats/backend/server/middleware"
)

func NewServer(ctx context.Context, logger *aslog.Logger, database dbal.Database, config *config.Config) http.Handler {
	mux := http.NewServeMux()

	listImageService := domain.NewListImageService()
	listEntryService := domain.NewListEntryService()
	listChunkService := domain.NewListChunkService()
	listSettingsService := domain.NewListSettingsService()
	listMetadataService := domain.NewListMetadataService()
	listEntryDataService := domain.NewListEntryDataService()
	syncUserService := domain.NewSyncUserService(database.UserRepository(), logger)
	anilistAuthService := domain.NewAnilistAuthService(config.Auth, logger)
	tokenService := domain.NewTokenService(config.Auth)

	syncListService := domain.NewSyncListService(
		database.ListRepository(),
		database.ListSettingsRepository(),
		logger,
	)

	translationService := domain.NewTranslationService(
		database.TranslationRepository(),
		logger,
	)

	seriesService := application.NewSeriesService()
	seriesDomainService := domain.NewSeriesService(database.SeriesRepository(), translationService, logger)

	syncSeriesService := domain.NewSyncSeriesService(
		database.SeriesRepository(),
		seriesDomainService,
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
		config.Sync,
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

	searchService := application.NewSearchService()

	userService := application.NewUserService(
		syncService,
		database.UserRepository(),
		database.ListRepository(),
		listMetadataService,
		logger,
	)

	listService := application.NewListService(
		listImageService,
		listEntryService,
		listChunkService,
		listSettingsService,
		listMetadataService,
		listEntryDataService,
		database.ListRepository(),
		seriesService,
		database.EntryRepository(),
		userService,
		syncService,
		database.SeriesRepository(),
		syncEntryService,
		database.TranslationRepository(),
	)

	authService := application.NewAuthService(
		config.Auth,
		config.Server,
		anilistAuthService,
		tokenService,
		database.UserRepository(),
		logger,
	)

	addRoutes(mux, userService, listService, searchService, authService, logger)

	syncService.Start(ctx)

	var handler http.Handler = mux

	// Add all middleware
	handler = middleware.Log(handler, logger)
	handler = middleware.Panic(handler, logger)

	return handler
}
