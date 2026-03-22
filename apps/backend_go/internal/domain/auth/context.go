package auth

import "context"

// Authorization is the type of value stored in the Contexts.
type Authorization struct {
	*Claims
}

// key is an unexported type for keys defined in this package.
// This prevents collisions with keys defined in other packages.
type key int

// userKey is the key for user.User values in Contexts. It is
// unexported; clients use auth.NewContext and auth.FromContext
// instead of using this key directly.
var userKey key

// NewContext returns a new Context that carries value u.
func NewContext(ctx context.Context, u *Authorization) context.Context {
	return context.WithValue(ctx, userKey, u)
}

// FromContext returns the User value stored in ctx, if any.
func FromContext(ctx context.Context) (*Authorization, bool) {
	u, ok := ctx.Value(userKey).(*Authorization)
	return u, ok
}
