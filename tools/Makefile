PROTOC_VERSION = 25.1
PROTOC_DIR = protoc

PROTOC_URL = https://github.com/protocolbuffers/protobuf/releases/download/v$(PROTOC_VERSION)/protoc-$(PROTOC_VERSION)-linux-x86_64.zip

TOOLS_DIR := $(shell dirname $(abspath $(lastword $(MAKEFILE_LIST))))
BIN_DIR   := $(TOOLS_DIR)/bin
PUB_CACHE := $(TOOLS_DIR)/.pub-cache

PROTOC_DIR     := $(TOOLS_DIR)/protoc
PROTOC         := $(BIN_DIR)/protoc
PROTOC_INCLUDE := $(PROTOC_DIR)/include
PROTOC_ARGS    := -I$(PROTOC_INCLUDE)

PROTOC_GEN_GO = $(BIN_DIR)/protoc-gen-go
PROTOC_GEN_GO_DEP = google.golang.org/protobuf/cmd/protoc-gen-go@latest

PROTOC_GEN_GO_GRPC = $(BIN_DIR)/protoc-gen-go-grpc
PROTOC_GEN_GO_GRPC_DEP = google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

PROTOC_GEN_DART = $(BIN_DIR)/protoc-gen-dart

PATH := ${PATH}:$(BIN_DIR)

protoc:
	mkdir -p $(PROTOC_DIR) $(BIN_DIR)
	curl -sL -o /tmp/protoc.zip $(PROTOC_URL) \
		&& unzip -o -d $(PROTOC_DIR) /tmp/protoc.zip bin/protoc 'include/*' \
		&& mv -f $(PROTOC_DIR)/bin/protoc $(PROTOC) \
		&& rm -f /tmp/protoc.zip \
		&& rmdir $(PROTOC_DIR)/bin
	$(call go-get-tool,$(PROTOC_GEN_GO),$(PROTOC_GEN_GO_DEP))
	$(call go-get-tool,$(PROTOC_GEN_GO_GRPC),$(PROTOC_GEN_GO_GRPC_DEP))
	PUB_CACHE=$(PUB_CACHE) dart pub global activate protoc_plugin \
		&& mv -f $(PUB_CACHE)/bin/protoc-gen-dart $(PROTOC_GEN_DART)
.PHONY: protoc

# go-get-tool will 'go get' any package $2 and install it to $1.
define go-get-tool
@[ -f $(1) ] || { \
set -e ;\
TMP_DIR=$$(mktemp -d) ;\
cd $$TMP_DIR ;\
go mod init tmp ;\
echo "Downloading $(2)" ;\
GOBIN=$(BIN_DIR) go install $(2) ;\
rm -rf $$TMP_DIR ;\
}
endef