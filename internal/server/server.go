package server

import "anistats/internal/config"

type Server struct {
	config config.Server
}

func New(conf config.Server) *Server {
	return &Server{config: conf}
}

func (s *Server) Serve() error {
	return nil
}
