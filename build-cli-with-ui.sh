#!/usr/bin/env bash

# flutter depends on core
cargo build -p anistats_core

pushd anistats_app/interface
    flutter build linux --release
popd

cargo build --release -p anistats_cli -F anistats_cli/ui

rm -rf ./.out
mkdir .out

cp -r anistats_app/interface/build/linux/x64/release/bundle/{data,lib} .out/

cp .cargo/out/release/anistats_cli .out/anistats
cp .cargo/out/release/*.so .out/lib/
