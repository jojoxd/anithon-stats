package impl

import (
	"context"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/grpc/base"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/grpc/models"
)

type TestServer struct {
	base.UnimplementedTestServer
}

func (s *TestServer) Hello(
	ctx context.Context, in *models.HelloRequest,
) (*models.HelloReply, error) {
	return &models.HelloReply{Test: 1234}, nil
}
