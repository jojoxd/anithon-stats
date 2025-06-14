package gkrouter

type BaseScreen struct {
	location RouteLocation
}

func (s *BaseScreen) Location() RouteLocation {
	return s.location
}

func (s *BaseScreen) OnIntent(intent Intent) error {
	s.location = intent.Location()

	return nil
}
