package domain

import (
	"context"
	"database/sql"

	"git.jojoxd.nl/projects/anistats/backend/internal_old/anilist"
	"git.jojoxd.nl/projects/anistats/backend/internal_old/anilist/generated"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"

	"git.jojoxd.nl/projects/anistats/backend/internal_old/domain/entity"
	"git.jojoxd.nl/projects/anistats/backend/internal_old/domain/repository"
)

type SyncUserService struct {
	userRepository repository.User
	logger         *aslog.Logger
}

func NewSyncUserService(userRepository repository.User, logger *aslog.Logger) *SyncUserService {
	return &SyncUserService{
		userRepository: userRepository,
		logger:         logger,
	}
}

func (s SyncUserService) SyncImmediateTx(ctx context.Context, userId string, tx *sql.Tx) (*entity.User, error) {
	user, err := s.userRepository.WithTx(tx).GetUser(ctx, userId)
	if err != nil {
		return nil, err
	}

	// todo
	client := anilist.NewClient(anilist.WithRateLimiter(s.logger))

	aluser, err := client.GetUser(ctx, user.AnilistId)
	if err != nil {
		return nil, err
	}

	updateUserDto := repository.UpdateUserDto{
		Name:      aluser.Name,
		AnilistId: user.AnilistId,
		AvatarUrl: s.resolveAvatar(aluser.Avatar),
	}

	if err = s.userRepository.WithTx(tx).UpdateUser(ctx, user.ID.String(), updateUserDto); err != nil {
		return nil, err
	}

	return s.userRepository.WithTx(tx).GetUser(ctx, userId)
}

func (s SyncUserService) resolveAvatar(avatar generated.UserAvatar) sql.NullString {
	if avatar.Large != "" {
		return sql.NullString{
			String: avatar.Large,
			Valid:  true,
		}
	}

	if avatar.Medium != "" {
		return sql.NullString{
			String: avatar.Medium,
			Valid:  true,
		}
	}

	return sql.NullString{
		String: "",
		Valid:  false,
	}
}
