#!/usr/bin/env bash
#
# Yakuake Skin Generator - update & reinstall
# Pulls the latest changes, refreshes dependencies and reinstalls the app.
#
# Usage:
#   ./update.sh            pull + rebuild + reinstall (desktop)
#   ./update.sh --web      pull + rebuild the web bundle only
#
set -euo pipefail

BLUE='\033[1;34m'
GREEN='\033[1;32m'
RED='\033[1;31m'
NC='\033[0m'
step() { echo -e "${BLUE}==>${NC} $1"; }
ok()   { echo -e "${GREEN} ✓${NC} $1"; }
fail() { echo -e "${RED} ✗${NC} $1" >&2; exit 1; }

cd "$(dirname "$0")"

step "Checking repository state"
if [ -n "$(git status --porcelain)" ]; then
    fail "Working tree has uncommitted changes — commit or stash them first."
fi
ok "working tree clean"

step "Pulling latest changes"
BRANCH=$(git rev-parse --abbrev-ref HEAD)
git pull --ff-only origin "$BRANCH" || fail "git pull failed — resolve manually"
ok "up to date on $BRANCH"

NEW_COMMIT=$(git rev-parse --short HEAD)
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "none")
echo -e "  at ${GREEN}${NEW_COMMIT}${NC} (last tag: ${LAST_TAG})"

step "Refreshing dependencies"
npm install --no-fund
ok "dependencies refreshed"

step "Rebuilding and reinstalling"
exec ./install.sh "$@"
