#!/usr/bin/env bash

rm -rf ./.out ./.cargo/out ./anistats_app/interface/build
mkdir .out

# flutter depends on core
cargo build -p anistats_core

pushd anistats_app/interface
    flutter build linux --release
popd

cargo rustc -p anistats_cli --bin anistats_cli --release -F anistats_cli/ui

cp -r anistats_app/interface/build/linux/x64/release/bundle/{data,lib} .out/

cp .cargo/out/release/anistats_cli .out/anistats
cp .cargo/out/release/*.so .out/lib/
