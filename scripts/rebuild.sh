#!/bin/bash
set -eu
set -o pipefail

if [ -n "$(git status --porcelain)" ]; then
  echo 'Error: working directory dirty' >&2
  exit 1
fi

case "$(git symbolic-ref --short -q HEAD)" in
  releases/v*)
    ;;
  *)
    echo 'Error: not on release branch' >&2
    exit 1
    ;;
esac

if [ ! -d node_modules ]; then
  echo 'Error: no node_modules directory' >&2
  exit 1
fi

rm -rf node_modules
npm install
npm run build
npm test
npm prune --production
git add node_modules

echo 'Rebuild done' >&2

git status
