package grpc

import (
	"database/sql"
	"log/slog"

	"github.com/grpc-ecosystem/go-grpc-middleware/v2/interceptors/logging"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/logging/grpc_adapter"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/services/user"
	user_store "gitlab.jojoxd.nl/jojoxd/anistats/internal/services/user/store"
	user_transport "gitlab.jojoxd.nl/jojoxd/anistats/internal/services/user/transport"
	user_transport_grpc "gitlab.jojoxd.nl/jojoxd/anistats/internal/services/user/transport/grpc"

	ping_transport "gitlab.jojoxd.nl/jojoxd/anistats/internal/services/ping/transport"
	ping_transport_grpc "gitlab.jojoxd.nl/jojoxd/anistats/internal/services/ping/transport/grpc"
)

func New(db *sql.DB) *grpc.Server {
	logOpts := []logging.Option{
		logging.WithLogOnEvents(logging.StartCall, logging.FinishCall),
	}

	server := grpc.NewServer(
		grpc.ChainUnaryInterceptor(
			logging.UnaryServerInterceptor(
				grpc_adapter.New(slog.Default()),
				logOpts...,
			),
		),

		grpc.ChainStreamInterceptor(
			logging.StreamServerInterceptor(
				grpc_adapter.New(slog.Default()),
				logOpts...,
			),
		),
	)

	user_svc := user.New(user_store.NewPostgres(db))
	user_grpc := user_transport.NewGrpc(user_svc)
	user_transport_grpc.RegisterUserServiceServer(server, user_grpc)

	ping_grpc := ping_transport.NewGrpc()
	ping_transport_grpc.RegisterPingServiceServer(server, ping_grpc)

	reflection.Register(server)

	return server
}
