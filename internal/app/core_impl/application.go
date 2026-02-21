package core_impl

import (
	"context"
	"fmt"
	"log/slog"

	"gioui.org/app"
	"gioui.org/layout"
	"gioui.org/op"
	"git.jojoxd.nl/projects/go-giorno/ext/glayout"
	localizerEvent "git.jojoxd.nl/projects/go-giorno/localizer/event"
	giornoI18n "git.jojoxd.nl/projects/go-giorno/pkg/giorno-i18n"
	routerEvent "git.jojoxd.nl/projects/go-giorno/router/event"

	"git.jojoxd.nl/projects/go-giorno/async"
	"git.jojoxd.nl/projects/go-giorno/async/fixedpool"
	"git.jojoxd.nl/projects/go-giorno/localizer"
	"git.jojoxd.nl/projects/go-giorno/router"

	"anistats/internal/app/api"
	"anistats/internal/app/core"
	"anistats/internal/app/core/theme"
	"anistats/internal/app/core_impl/views"
	"anistats/internal/app/resources"
	"anistats/internal/config"
)

var _ core.Application = (*Application)(nil)

type Application struct {
	window           *app.Window
	theme            *theme.Theme
	rootView         *views.Root
	localizerManager localizer.Manager
	logger           *slog.Logger
	clientBundle     api.ClientBundle
	router           router.Router
	gkAsyncScheduler async.Scheduler
	layoutHelper     *glayout.Helper
}

func NewApplication(window *app.Window) (*Application, error) {
	bundle, err := res.LocaleBundle()
	if err != nil {
		return nil, err
	}

	localizerManager, err := giornoI18n.NewManager(
		giornoI18n.WithBundle(bundle),
		giornoI18n.WithFallbackLocale(res.LocaleEnglish),
		giornoI18n.WithEventing(8),
		giornoI18n.WithLogger(slog.Default()),
	)
	if err != nil {
		return nil, err
	}

	clientBundle, err := api.NewClientBundle(config.AppClient{
		Type: config.ClientTypeEmbedded,
	})
	if err != nil {
		return nil, err
	}

	router := router.NewRouter(
		router.WithLogger(slog.Default()),
		router.WithEventing(),
	)

	gkAsyncScheduler := fixedpool.NewScheduler(window,
		fixedpool.Logger(slog.Default()),
		fixedpool.Workers(4),
	)

	palette, err := res.DefaultPalette()
	if err != nil {
		return nil, err
	}

	application := &Application{
		window:           window,
		router:           router,
		theme:            theme.New(palette),
		localizerManager: localizerManager,
		clientBundle:     clientBundle,
		logger:           slog.Default(),
		gkAsyncScheduler: gkAsyncScheduler,
		layoutHelper:     glayout.NewHelper(),
	}

	return application, nil
}

func (a *Application) Run(ctx context.Context) error {
	var ops op.Ops

	eventCtx, cancelEventHandler := context.WithCancel(ctx)

	go func() {
		a.handleEvents(eventCtx)
	}()

	for {
		a.logger.Debug("loop")

		switch ev := a.window.Event().(type) {
		case app.DestroyEvent:
			a.logger.Debug("eventLoop: destroy")
			cancelEventHandler()
			return ev.Err

		case app.FrameEvent:
			gtx := app.NewContext(&ops, ev)

			a.layoutHelper.Update(gtx)

			a.layout(gtx)
			ev.Frame(gtx.Ops)
		}
	}
}

func (a *Application) Logger() *slog.Logger {
	return a.logger
}

func (a *Application) layout(gtx layout.Context) layout.Dimensions {
	if a.rootView == nil {
		a.rootView = views.NewRoot(a)
	}

	return a.rootView.Layout(gtx)
}

func (a *Application) Localizer() localizer.Localizer {
	return a.localizerManager.Localizer()
}

func (a *Application) LocalizerManager() localizer.Manager {
	return a.localizerManager
}

func (a *Application) Theme() *theme.Theme {
	return a.theme
}

func (a *Application) ApiClient() api.ClientBundle {
	return a.clientBundle
}

func (a *Application) Router() router.Router {
	return a.router
}

func (a *Application) GkAsyncScheduler() async.Scheduler {
	return a.gkAsyncScheduler
}

func (a *Application) LayoutHelper() *glayout.Helper {
	return a.layoutHelper
}

func (a *Application) handleEvents(ctx context.Context) {
	for {
		select {
		case ev := <-a.localizerManager.Events():
			a.handleLocalizerEvent(ev)

		case ev := <-a.router.Events():
			a.handleRouterEvent(ev)

		case <-ctx.Done():
			panic("context canceled")
		}
	}
}

func (a *Application) handleLocalizerEvent(ev localizerEvent.Event) {
	switch ev := ev.(type) {
	case localizerEvent.LocaleChangedEvent:
		a.logger.Info("Locale changed", "old", ev.OldLocale, "new", ev.NewLocale)
		a.window.Invalidate()

	case localizerEvent.LocalizationNotFoundEvent:
		a.logger.Warn("localization not found",
			slog.String("key", ev.Key),
			slog.String("locale", ev.Locale.String()),
		)
	}
}

func (a *Application) handleRouterEvent(ev routerEvent.Event) {
	switch ev := ev.(type) {
	case *routerEvent.NavigationEvent:
		a.logger.Info("router navigation event", "ev", ev)

		title := a.Localizer().T(fmt.Sprintf("page.%s.title", ev.Intent.Target()))

		a.window.Option(app.Title(title))
		a.window.Invalidate()
	}
}
