POSTGRES_DSN = "user=anistats-dev password=anistats-dev host=172.16.4.15 database=anistats-dev"

all: gen-proto app-linux

cli:
	go build -o .out/anistats ./cmd/anistats/main.go

app-%:
	cd dart/anistats_app && flutter build $* && mv build/$*/*/release/bundle ../../.out/app-$*

gen-proto:
	$(PROTOC) \
		--proto_path=./proto \
		--go_out=. \
		--go_opt=module=gitlab.jojoxd.nl/jojoxd/anistats \
		--go-grpc_out=. \
		--go-grpc_opt=module=gitlab.jojoxd.nl/jojoxd/anistats \
		--dart_out="generate_kythe_info:./dart/anistats_api/lib/gen" \
		./proto/*.proto

migration: goose sqlc
	@test -n "$(NAME)" || (echo "Set a NAME for the migration"; exit 1)
	GOOSE_MIGRATION_DIR=internal/db/postgres/sql/migrations \
		$(GOOSE) postgres $(POSTGRES_DSN) create $(NAME) sql

migrate: goose
	GOOSE_MIGRATION_DIR=internal/db/postgres/sql/migrations \
		$(GOOSE) postgres $(POSTGRES_DSN) up

codegen-database: sqlc
	$(SQLC) generate -f tools/sqlc.yaml

# go-get-tool will 'go get' any package $2 and install it to $1.
PROJECT_DIR := $(shell dirname $(abspath $(lastword $(MAKEFILE_LIST))))
define go-get-tool
@[ -f $(1) ] || { \
set -e ;\
TMP_DIR=$$(mktemp -d) ;\
cd $$TMP_DIR ;\
go mod init tmp ;\
echo "Downloading $(2)" ;\
GOBIN=$(PROJECT_DIR)/tools/bin go install $(2) ;\
rm -rf $$TMP_DIR ;\
}
endef

PROTOC_VERSION = 25.1
PROTOC_URL = https://github.com/protocolbuffers/protobuf/releases/download/v$(PROTOC_VERSION)/protoc-$(PROTOC_VERSION)-linux-x86_64.zip
PROTOC_DIR = $(shell pwd)/tools/bin
PROTOC = $(PROTOC_DIR)/protoc

PROTOC_GEN_GO = $(shell pwd)/tools/bin/protoc-gen-go
PROTOC_GEN_GO_DEP = google.golang.org/protobuf/cmd/protoc-gen-go@latest

PROTOC_GEN_GO_GRPC = $(shell pwd)/tools/bin/protoc-gen-go-grpc
PROTOC_GEN_GO_GRPC_DEP = google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

PATH := $(shell echo $$PATH):$(shell pwd)/tools/bin:$(shell pwd)/tools/.pub-cache/bin

protoc:
	mkdir -p $(PROTOC_DIR)
	curl -sL -o /tmp/protoc.zip $(PROTOC_URL) && unzip -o -j -d $(PROTOC_DIR) /tmp/protoc.zip bin/protoc && rm /tmp/protoc.zip
	$(call go-get-tool,$(PROTOC_GEN_GO),$(PROTOC_GEN_GO_DEP))
	$(call go-get-tool,$(PROTOC_GEN_GO_GRPC),$(PROTOC_GEN_GO_GRPC_DEP))
	PUB_CACHE=tools/.pub-cache dart pub global activate protoc_plugin

SQLC = $(shell pwd)/tools/bin/sqlc
SQLC_DEP = github.com/sqlc-dev/sqlc/cmd/sqlc@latest
sqlc:
	$(call go-get-tool,$(SQLC),$(SQLC_DEP))

GOOSE = $(shell pwd)/tools/bin/goose
GOOSE_DEP = github.com/pressly/goose/v3/cmd/goose@latest
goose:
	$(call go-get-tool,$(GOOSE),$(GOOSE_DEP))
