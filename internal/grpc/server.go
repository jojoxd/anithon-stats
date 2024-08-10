package grpc

import (
	"log"
	"net"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/config"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/grpc/base"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/grpc/impl"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

func Serve(config *config.Config) {
	listener, err := net.Listen("tcp", ":8080")
	if err != nil {
		log.Fatalln("failed to create listener:", err)
	}

	s := grpc.NewServer()
	reflection.Register(s)

	base.RegisterTestServer(s, &impl.TestServer{})
	if err := s.Serve(listener); err != nil {
		log.Fatalln("failed to serve:", err)
	}
}
