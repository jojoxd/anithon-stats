package server

import (
	"context"
	"net/http"

	"git.jojoxd.nl/projects/aslog"

	"git.jojoxd.nl/projects/anistats/backend/ent"
	"git.jojoxd.nl/projects/anistats/backend/internal/anilist"
	"git.jojoxd.nl/projects/anistats/backend/internal/application"
	"git.jojoxd.nl/projects/anistats/backend/internal/config"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain"
	"git.jojoxd.nl/projects/anistats/backend/server/middleware"
)

func NewServer(ctx context.Context, logger *aslog.Logger, database *ent.Client, config *config.Config) http.Handler {
	mux := http.NewServeMux()

	// listImageService := domain.NewListImageService()
	// listEntryService := domain.NewListEntryService()
	// listChunkService := domain.NewListChunkService()
	// listSettingsService := domain.NewListSettingsService()
	// listMetadataService := domain.NewListMetadataService(database.SeriesRepository())
	// listEntryDataService := domain.NewListEntryDataService()
	// syncUserService := domain.NewSyncUserService(database.UserRepository(), logger)
	anilistAuthService := domain.NewAnilistAuthService(config.Auth, logger)
	tokenService := domain.NewTokenService(config.Auth)

	// syncListService := domain.NewSyncListService(
	// 	database.ListRepository(),
	// 	database.ListSettingsRepository(),
	// 	logger,
	// )
	//
	// translationService := domain.NewTranslationService(
	// 	database.TranslationRepository(),
	// 	logger,
	// )
	//
	// seriesService := application.NewSeriesService()
	// seriesDomainService := domain.NewSeriesService(database.SeriesRepository(), translationService, logger)
	//
	// syncSeriesService := domain.NewSyncSeriesService(
	// 	database.SeriesRepository(),
	// 	seriesDomainService,
	// 	translationService,
	// 	logger,
	// )
	//
	// syncEntryService := domain.NewSyncEntryService(
	// 	database.EntryRepository(),
	// 	database.EntryDataRepository(),
	// 	database.SeriesRepository(),
	// 	logger,
	// )
	//
	// syncService := application.NewSyncService(
	// 	config.Sync,
	// 	database,
	// 	database.UserRepository(),
	// 	database.ListRepository(),
	// 	database.ListSettingsRepository(),
	// 	syncUserService,
	// 	syncListService,
	// 	syncSeriesService,
	// 	syncEntryService,
	// 	logger,
	// )

	anilistClient := anilist.NewClient()

	userService := application.NewUserService(
		database,
		anilistClient,
	)

	listDomainService := domain.NewListService(logger)
	entryDomainService := domain.NewEntryService()

	listService := application.NewListService(
		database,
		listDomainService,
		entryDomainService,
		// listImageService,
		// listEntryService,
		// listChunkService,
		// listSettingsService,
		// listMetadataService,
		// listEntryDataService,
		// seriesService,
		// syncService,
		// syncEntryService,
	)

	authService := application.NewAuthService(
		config.Auth,
		config.Server,
		anilistAuthService,
		tokenService,
		userService,
		logger,
	)

	seriesDomainService := domain.NewSeriesService()

	syncSeriesService := domain.NewSyncSeriesService(seriesDomainService, logger)

	syncService := application.NewSyncService(
		listDomainService,
		seriesDomainService,
		entryDomainService,
		syncSeriesService,
		logger,
	)

	syncService = syncService // todo: use syncService

	searchService := application.NewSearchService(database, syncSeriesService, anilistClient, logger)

	addRoutes(mux, userService, listService, searchService, authService, logger)

	// syncService.Start(ctx)

	var handler http.Handler = mux

	// Add all middleware
	handler = middleware.Log(handler, logger)
	handler = middleware.Panic(handler, logger)

	return handler
}
