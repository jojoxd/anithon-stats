package main

import (
	"context"
	"fmt"
	"log"
	"log/slog"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/config"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/dbal"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/services/activity"
	activitystore "gitlab.jojoxd.nl/jojoxd/anistats/internal/services/activity/store"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/services/list"
	liststore "gitlab.jojoxd.nl/jojoxd/anistats/internal/services/list/store"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/services/user"
	userstore "gitlab.jojoxd.nl/jojoxd/anistats/internal/services/user/store"
)

func main() {
	slog.Info("Hello, World!")

	slog.SetLogLoggerLevel(slog.LevelDebug)

	ctx := context.Background()

	db, err := dbal.New(
		&config.DatabaseConfig{
			Dsn: "postgres://anistats-dev:anistats-dev@172.16.4.15:5432/anistats-dev",
		},
	)

	if err != nil {
		panic(err)
	}

	defer db.Close()

	usr := user.New(userstore.NewPostgres(db))
	act := activity.New(activitystore.NewPostgres(db))
	lst := list.New(liststore.NewPostgres(db))

	slog.Info("Create / Fetch User")
	u, err := usr.Create(ctx, user.CreateUser{
		Name:         "jojoxd",
		PasswordHash: "hello-world",
	})
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Printf("%+v\n", u)

	fmt.Printf("Create / Fetch List")
	l, err := lst.Create(ctx, list.CreateList{
		Name:   "Hello List",
		UserId: u.Id,
	})
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Printf("%+v\n", l)

	fmt.Printf("Create / Fetch Activity")
	a, err := act.CreateList(ctx, activity.CreateList{
		Common: activity.CreateActivity{
			UserId: u.Id,
		},
		Type:   activity.ListCreated,
		ListId: l.Id,
	})
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Printf("%+v\n", a)

	a2, err := act.Get(ctx, a.Id())
	if err != nil {
		log.Fatalln(err)
	}

	au, _ := usr.Get(ctx, a.UserId())
	switch q := a2.(type) {
	case activity.List:
		fmt.Printf("%s %s a list\n", au.Name, q.ActivityType())
	}
}
