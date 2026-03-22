package server

import (
	"context"
	"errors"
	"log/slog"
	"net"
	"net/http"
	"os"
	"strconv"
	"sync"
	"time"

	"git.jojoxd.nl/projects/anistats/backend/internal/config"
	"git.jojoxd.nl/projects/anistats/backend/internal/dbal"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"
)

func Serve(ctx context.Context, logger *aslog.Logger, config *config.Config) error {
	database, err := dbal.New(config.Dbal, logger)
	if err != nil {
		return err
	}

	if err := database.Migrate(ctx); err != nil {
		return err
	}

	if err := database.Open(ctx); err != nil {
		return err
	}

	srv := NewServer(ctx, logger, database, config)

	httpServer := &http.Server{
		Addr:    net.JoinHostPort(config.Server.Host, strconv.Itoa(int(config.Server.Port))),
		Handler: srv,
	}

	go func() {
		logger.Info("server listening", slog.Any("addr", httpServer.Addr))

		if err := httpServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("server closed", slog.Any("err", err))
			os.Exit(1)
		}

		logger.Info("server stopped")
	}()

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		<-ctx.Done()

		shutdownContext := context.Background()
		shutdownContext, cancel := context.WithTimeout(shutdownContext, 10*time.Second)
		defer cancel()

		if err := httpServer.Shutdown(shutdownContext); err != nil {
			logger.Error("failed to shutdown server", slog.Any("err", err))
			os.Exit(1)
		}
	}()

	wg.Wait()

	return nil
}
