package transport

import (
	"context"
	"google.golang.org/protobuf/types/known/timestamppb"

	"github.com/google/uuid"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/grpc/ext"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/services/user"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/services/user/transport/grpc"
)

type UserServiceServer struct {
	svc user.Service
	grpc.UnimplementedUserServiceServer
}

func NewGrpc(svc user.Service) *UserServiceServer {
	return &UserServiceServer{svc: svc}
}

func (srv *UserServiceServer) Search(ctx context.Context, req *grpc.SearchRequest) (*grpc.SearchResponse, error) {
	users, err := srv.svc.Search(ctx, req.Query)
	if err != nil {
		return nil, err
	}

	grpcUsers := make([]*grpc.User, len(users))
	for i, u := range users {
		grpcUsers[i] = &grpc.User{
			Id:       &ext.Uuid{Id: u.Id.String()},
			Name:     u.Name,
			JoinedAt: timestamppb.New(u.CreatedAt),
		}
	}

	response := &grpc.SearchResponse{
		Users: &grpc.Users{
			Users: grpcUsers,
		},
	}

	return response, nil
}

func (srv *UserServiceServer) Profile(ctx context.Context, ident *grpc.UserIdentifier) (*grpc.Profile, error) {
	id, err := uuid.Parse(ident.Id.Id)
	if err != nil {
		return nil, err
	}

	model, err := srv.svc.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	profile := &grpc.Profile{
		User: &grpc.User{
			Id:       &ext.Uuid{Id: model.Id.String()},
			Name:     model.Name,
			JoinedAt: timestamppb.New(model.CreatedAt),
		},
	}

	return profile, nil
}
