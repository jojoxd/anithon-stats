/*
	MIT License

	# Copyright (c) 2024 Šimon Woidig

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

	Adapted from https://github.com/simukti/sqldb-logger/issues/74#issuecomment-2356135721
*/

package logging

import (
	"context"
	"fmt"
	"log/slog"
	"regexp"
	"strings"
	"time"

	"github.com/simukti/sqldb-logger"

	"anistats/internal/logging"
)

// SqlDBLoggerLevelSlog implements slog.Leveler.
// This level is used to convert sqldblogger.Level to slog.Level.
type SqlDBLoggerLevelSlog sqldblogger.Level

// Level implements slog.Leveler.
func (s *SqlDBLoggerLevelSlog) Level() slog.Level {
	switch *s {
	case SqlDBLoggerLevelSlog(sqldblogger.LevelTrace):
		return logging.LevelSilly.Level()
	case SqlDBLoggerLevelSlog(sqldblogger.LevelDebug):
		return logging.LevelDebug.Level()
	case SqlDBLoggerLevelSlog(sqldblogger.LevelInfo):
		return logging.LevelSql.Level()
	case SqlDBLoggerLevelSlog(sqldblogger.LevelError):
		return logging.LevelError.Level()
	default:
		return logging.LevelInfo.Level()
	}
}

// Interface guard
var _ slog.Leveler = (*SqlDBLoggerLevelSlog)(nil)

// SlogAdapter implements sqldblogger.Logger.
// This adapter logs using the standard `log/slog` package.
type SlogAdapter struct {
	logger *slog.Logger
}

// Log implements sqldblogger.Logger.
func (s *SlogAdapter) Log(ctx context.Context, level sqldblogger.Level, msg string, data map[string]interface{}) {
	slogLevel := SqlDBLoggerLevelSlog(level)

	s.logger.Log(ctx, slogLevel.Level(), remapMessage(msg), parseAttrs(data)...)
}

// Interface guard
var _ sqldblogger.Logger = (*SlogAdapter)(nil)

// NewSlogAdapter creates a new SlogAdapter from a given slog.Logger.
func NewSlogAdapter(logger *slog.Logger) *SlogAdapter {
	return &SlogAdapter{
		logger: logger,
	}
}

var queryRe = regexp.MustCompile(`(?sm)^\s*--\s*name:\s*(?P<name>[^ ]+)\s*:(?P<method>\S+)\s*(?P<query>.+)$`)
var queryNormalizerRe = regexp.MustCompile(`(?sm)(\\n\s+|\\n|\n\s+|\n|\s+)`)

func parseAttrs(data map[string]any) []any {
	attrs := make([]any, 0, len(data))

loop:
	for k, v := range data {
		switch k {
		case "time":
			// Drop time, handled by slog
			continue loop

		case "duration":
			if dur, err := time.ParseDuration(fmt.Sprintf("%fs", v.(float64))); err == nil {
				attrs = append(attrs, slog.Duration("duration", dur))
			} else {
				attrs = append(attrs, slog.Any("duration", v))
			}

		case "query":
			query := strings.Replace(v.(string), "\\n", "\n", -1)
			if queryRe.MatchString(query) {
				attrs = append(attrs, normalizeQuery(query)...)
			} else {
				attrs = append(attrs, slog.Any(k, v))
			}

		case "conn_id":
			attrs = append(attrs, slog.Any("conn.id", v))

		case "stmt_id":
			attrs = append(attrs, slog.Any("stmt.id", v))

		case "args":
			attrs = append(attrs, slog.Any("query.args", v))

		default:
			attrs = append(attrs, slog.Any(k, v))
		}
	}

	return attrs
}

func normalizeQuery(query string) []any {
	matches := queryRe.FindStringSubmatch(query)
	queryItems := make([]any, 0, 3)

	for i, name := range queryRe.SubexpNames() {
		if i != 0 && name != "" {
			value := matches[i]

			if name == "query" {
				value = queryNormalizerRe.ReplaceAllString(matches[i], " ")
			}

			value = strings.TrimSpace(value)
			queryItems = append(queryItems, slog.Any(
				fmt.Sprintf("query.%s", name),
				value,
			))
		}
	}

	return queryItems
}

func remapMessage(msg string) string {
	switch msg {
	case "PrepareContext":
		return "dbal: prepare"

	case "StmtQueryContext":
		return "dbal: execute query"

	default:
		return msg
	}
}
