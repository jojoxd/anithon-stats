package application

import (
	"context"

	"github.com/google/uuid"

	"git.jojoxd.nl/projects/anistats/backend/ent"
	"git.jojoxd.nl/projects/anistats/backend/ent/user"
	"git.jojoxd.nl/projects/anistats/backend/internal/anilist"
)

type UserService struct {
	db      *ent.Client
	anilist *anilist.Client
}

func NewUserService(db *ent.Client, anilist *anilist.Client) *UserService {
	return &UserService{
		db:      db,
		anilist: anilist,
	}
}

func (svc UserService) GetByAnilistId(ctx context.Context, anilistId uint) (*ent.User, error) {
	return svc.db.User.Query().Where(user.AnilistIDEQ(anilistId)).Only(ctx)
}

func (svc UserService) GetById(ctx context.Context, id uuid.UUID) (*ent.User, error) {
	return svc.db.User.Get(ctx, id)
}

func (svc UserService) CreateByAnilistId(ctx context.Context, anilistId uint) (*ent.User, error) {
	anilistUser, err := svc.anilist.GetUser(ctx, anilistId)
	if err != nil {
		return nil, err
	}

	return svc.db.User.Create().
		SetName(anilistUser.Name).
		SetAnilistID(anilistId).
		SetAvatarURL(anilistUser.Avatar.Large).
		Save(ctx)
}
