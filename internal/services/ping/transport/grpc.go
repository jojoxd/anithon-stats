package transport

import (
	"context"
	"log/slog"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/services/ping/transport/grpc"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/version"
)

type PingServiceServer struct {
	grpc.UnimplementedPingServiceServer
}

func NewGrpc() *PingServiceServer {
	return &PingServiceServer{}
}

func (srv *PingServiceServer) Ping(ctx context.Context, req *grpc.Ping) (*grpc.Pong, error) {

	slog.Info("Ping", "ClientVersion", req.ClientVersion)

	res := &grpc.Pong{
		ServerVersion: version.Version,
	}

	return res, nil
}
