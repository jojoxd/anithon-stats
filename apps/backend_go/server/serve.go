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

	"git.jojoxd.nl/projects/aslog"

	"git.jojoxd.nl/projects/anistats/backend/ent"
	"git.jojoxd.nl/projects/anistats/backend/internal/config"
)

func Serve(ctx context.Context, logger *aslog.Logger, config *config.Config) error {
	database, err := ent.Open("postgres", config.Dbal.Dsn, ent.Debug())
	if err != nil {
		return err
	}
	defer database.Close()

	// migrate it
	if err := database.Schema.Create(ctx); err != nil {
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
