#!/usr/bin/env bash

rm -rf ./.out ./.cargo/out ./anistats_app/interface/build
mkdir .out

# flutter depends on core
cargo build -p anistats_core

pushd anistats_app/interface
    flutter build linux --release
popd

# cargo build
cargo rustc -p anistats_cli --bin anistats_cli --release -F anistats_cli/ui
cargo rustc -p anistats_core_ffi --release -- -C prefer-dynamic

cp -r anistats_app/interface/build/linux/x64/release/bundle/{data,lib} .out/

cp .cargo/out/release/anistats_cli .out/anistats
cp .cargo/out/release/*.so .out/lib/

# @HACK: TODO: Fix this
cp /home/jojoxd/.rustup/toolchains/stable-x86_64-unknown-linux-gnu/lib/libstd-6e3078511c661ac3.so .out/lib/
