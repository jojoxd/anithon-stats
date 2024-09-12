POSTGRES_DSN = "user=anistats-dev password=anistats-dev host=172.16.4.15 database=anistats-dev"

GOOSE = github.com/pressly/goose/v3/cmd/goose@master
SQLC = github.com/sqlc-dev/sqlc/cmd/sqlc@latest

all: gen-proto app-linux build-cli

app-%:
	cd dart/anistats_app && flutter build $* && mv build/$*/*/release/bundle ../../.out/app-$*

serve: build-cli
	.out/anistats serve

gen-proto: protoc
	$(PROTOC) $(PROTOC_ARGS) \
		--proto_path=./api/protobuf \
		--go_out=. \
		--go_opt=module=gitlab.jojoxd.nl/jojoxd/anistats \
		--go-grpc_out=. \
		--go-grpc_opt=module=gitlab.jojoxd.nl/jojoxd/anistats \
		--dart_out="grpc,generate_kythe_info:./dart/anistats_api/lib/gen" \
		./api/protobuf/**/*.proto ./api/protobuf/*.proto

	$(PROTOC) $(PROTOC_ARGS) \
		--dart_out="grpc,generate_kythe_info:./dart/anistats_api/lib/gen" \
		$(PROTOC_INCLUDE)/google/protobuf/timestamp.proto

migration:
	@test -n "$(NAME)" || (echo "Set a NAME for the migration"; exit 1)
	GOOSE_MIGRATION_DIR=internal/dbal/postgres/sql/migrations \
		go run $(GOOSE) \
			postgres $(POSTGRES_DSN) \
			create $(NAME) sql

migrate:
	GOOSE_MIGRATION_DIR=internal/dbal/postgres/sql/migrations \
		go run $(GOOSE) \
			postgres $(POSTGRES_DSN) \
			up

api-lint:
	go run github.com/googleapis/api-linter/cmd/api-linter@latest \
		./api/protobuf/**/*.proto

codegen-database:
	go run $(SQLC) \
		generate -f tools/sqlc.yaml

include ./tools/Makefile
include ./cmd/anistats/Makefile