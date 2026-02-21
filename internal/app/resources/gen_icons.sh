#!/usr/bin/env bash

magick ./icon_android_original.png \
  -background '#EDE7F6' \
  -gravity center \
  -extent 3900x3900 \
    icon_android.png

file ./icon_android.png