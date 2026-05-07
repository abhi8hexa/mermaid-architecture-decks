#!/bin/sh
set -e

mkdir -p output

for file in diagrams/*.mmd; do
  name=$(basename "$file" .mmd)
  npm run build:pptx "$file" "output/$name.pptx"
done