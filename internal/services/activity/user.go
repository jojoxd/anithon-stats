package activity

type UserActivityType string

const (
	UserCreated UserActivityType = "created"
)

func NewUser(common Common, activityType UserActivityType) User {
	return User{
		Common:       common,
		activityType: activityType,
	}
}

type User struct {
	Common

	activityType UserActivityType
}

func (u User) ActivityType() UserActivityType {
	return u.activityType
}
