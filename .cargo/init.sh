#!/usr/bin/env bash

##
## Install tools into ./tools
##

SCRIPT_PATH=$(dirname "${BASH_SOURCE[0]}")

# Locally install these tools
export CARGO_INSTALL_ROOT=".cargo/tools"

CRATES=$(
    yq -otsv '.install.dependencies | to_entries | map(.key + "@" + .value.version)' \
        ${SCRIPT_PATH}/../Cargo.toml
)

cargo install --force ${CRATES}
