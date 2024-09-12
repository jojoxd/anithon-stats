GO_MODULE   := $(shell go list -m)

DATE        := $(shell date)

GIT_TAG     := $(shell git describe --tags --always --abbrev=0 --match="v[0-9]*.[0-9]*.[0-9]*" 2> /dev/null)
GIT_VERSION := $(shell echo "${TAG}" | sed 's/^.//')
COMMIT_HASH := $(shell git rev-parse --short HEAD)

LDFLAGS += -X '$(GO_MODULE)/internal/version.CommitHash=${COMMIT_HASH}'
LDFLAGS += -X '$(GO_MODULE)/internal/version.CompileDate=${DATE}'

# If we have a tag
ifneq ($(GIT_TAG), $(shell git rev-parse HEAD))
	LDFLAGS += -X $(GO_MODULE)/internal/version.Version=${GIT_VERSION}
endif

build-cli:
	go build -ldflags="$(LDFLAGS)" \
		-o .out/anistats cmd/anistats/main.go
.PHONY: build-cli

# package-cli-apt:
# package-cli-bla: