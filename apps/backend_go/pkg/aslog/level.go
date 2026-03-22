package aslog

import "log/slog"

type level slog.Level

func (l level) String() string {
	switch l {
	case LevelSilly:
		return "SIL"
	case LevelSql:
		return "SQL"
	case LevelDebug:
		return "DBG"
	case LevelInfo:
		return "INF"
	case LevelHttp:
		return "REQ"
	case LevelWarn:
		return "WRN"
	case LevelError:
		return "ERR"
	case LevelEmergency:
		return "EMG"
	default:
		return "WRN"
	}
}

func (l level) Color() uint8 {
	switch l {
	case LevelSilly:
		return ansiDarkGrey
	case LevelSql:
		return ansiDarkCyan
	case LevelDebug:
		return ansiDarkBlue
	case LevelInfo:
		return ansiDarkGreen
	case LevelHttp:
		return ansiMagenta
	case LevelWarn:
		return ansiYellow
	case LevelError:
		return ansiRed
	case LevelEmergency:
		return ansiDarkRed
	default:
		return ansiYellow
	}
}

func (l level) Level() slog.Level {
	return slog.Level(l)
}
