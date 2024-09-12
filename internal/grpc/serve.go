package grpc

import (
	"fmt"
	"log/slog"
	"net"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/config"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/dbal"
)

func Serve(cfg *config.Config) error {
	db, err := dbal.New(cfg.Database)
	if err != nil {
		return err
	}

	defer db.Close()

	server := New(db)

	addr := fmt.Sprintf("%s:%d", cfg.Server.Host, cfg.Server.Port)
	listener, err := net.Listen("tcp", addr)
	if err != nil {
		return err
	}

	slog.Info("Serving", "Address", addr)

	err = server.Serve(listener)

	return err
}
