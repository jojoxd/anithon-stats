package application

import (
	"context"
	"log/slog"

	"git.jojoxd.nl/projects/anistats/backend/api"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/repository"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"
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

// todo should be pure
func (u UserService) GetLists(ctx context.Context, userId string) (*api.UserListsResponse, error) {
	user, err := u.GetUser(ctx, userId)
	if err != nil {
		return nil, err
	}

	// lists := map[string]api.ListMetadata{
	// 	"1": {
	// 		Title:       "List 1",
	// 		Ref:         api.NewListRef("1"),
	// 		Description: "List 1 Description",
	// 		Stats: api.ListMetadataStats{
	// 			Time: 12345,
	// 		},
	// 	},
	// 	"2": {
	// 		Title:       "List 2",
	// 		Ref:         api.NewListRef("2"),
	// 		Description: "List 2 Description",
	// 		Stats: api.ListMetadataStats{
	// 			Time: 23456,
	// 		},
	// 	},
	// }

	lists, err := u.listRepository.GetUserLists(ctx, user.Id)
	listMetadatas := make(map[string]api.ListMetadata, len(lists))
	for _, list := range lists {
		listMetadatas[list.Id] = u.listMetadataService.CreateMetadata(*list)
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
