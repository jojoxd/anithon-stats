package application

import (
	"context"
	"log/slog"

	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"

	"git.jojoxd.nl/projects/anistats/backend/api"
	"git.jojoxd.nl/projects/anistats/backend/internal_old/domain"
	"git.jojoxd.nl/projects/anistats/backend/internal_old/domain/repository"
)

type UserService struct {
	syncService         *SyncService
	userRepository      repository.User
	listRepository      repository.List
	listMetadataService *domain.ListMetadataService
	logger              *aslog.Logger
}

func NewUserService(
	syncService *SyncService,
	userRepository repository.User,
	listRepository repository.List,
	listMetadataService *domain.ListMetadataService,
	logger *aslog.Logger,
) *UserService {
	return &UserService{
		syncService:         syncService,
		userRepository:      userRepository,
		listRepository:      listRepository,
		listMetadataService: listMetadataService,
		logger:              logger,
	}
}

func (u UserService) GetLists(ctx context.Context, userId string) (*api.UserListsResponse, error) {
	user, err := u.GetUser(ctx, userId)
	if err != nil {
		return nil, err
	}

	lists, err := u.listRepository.GetUserLists(ctx, user.Id)
	listMetadatas := make(map[string]api.ListMetadata, len(lists))
	for _, list := range lists {
		listMetadatas[list.ID.String()] = u.listMetadataService.GetMetadata(ctx, list)
	}

	resp := &api.UserListsResponse{User: *user, Lists: listMetadatas}

	return resp, nil
}

func (u UserService) GetUser(ctx context.Context, userId string) (*api.User, error) {
	// get user from db, if not exists, create and start sync
	userEntity, err := u.userRepository.GetUser(ctx, userId)

	if err != nil {
		u.logger.Error("fetch user failed", slog.Any("userId", userId), slog.Any("err", err))

		return nil, err
	}

	user := userEntity.AsApi()

	// if user can be synced (e.g. using timeout since last sync)
	// if true == true {
	// 	u.syncService.Queue(&sync.JobUser{Ref: userEntity.AsRef()})
	// }

	return &user, nil
}
