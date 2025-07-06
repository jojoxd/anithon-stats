package logging

import (
	"fmt"
	"log/slog"
	"os"

	"anistats/internal/constants"
)

func init() {
	// Try to fetch log level
	selectedLevel := LevelSilly
	if levelStr, ok := os.LookupEnv("LOG_LEVEL"); ok {
		selectedLevel = parseLogLevel(levelStr)
	}

	// Try to fetch log type
	selectedOutputType := outputTypeText
	if outputTypeStr, ok := os.LookupEnv("LOG_FORMAT"); ok {
		switch outputTypeStr {
		case "json":
			selectedOutputType = outputTypeJson
		case "text":
			selectedOutputType = outputTypeText
		default:
			panic(fmt.Sprintf("unknown log output type: %s", outputTypeStr))
		}
	}

	platformHandler := getHandler()
	opts := &slog.HandlerOptions{
		Level: selectedLevel,
	}

	if constants.AppDebug || int(selectedLevel) < int(LevelInfo) {
		opts.AddSource = true
	}

	logger := slog.Default()

	// Set logger
	switch selectedOutputType {
	//goland:noinspection GoDfaConstantCondition
	case outputTypeJson:
		logger = slog.New(platformHandler.Json(opts))

	//goland:noinspection GoDfaConstantCondition
	case outputTypeText:
		opts.ReplaceAttr = replaceAttr

		logger = slog.New(platformHandler.Text(opts))
	}

	slog.SetDefault(logger)
}
