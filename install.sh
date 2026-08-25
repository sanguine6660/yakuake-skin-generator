#!/usr/bin/env bash
#
# Yakuake Skin Generator - build & install
# Detects your system, builds the desktop app (or web bundle with --web)
# and installs it with the native package manager.
#
# Usage:
#   ./install.sh            detect system → build → install
#   ./install.sh --appimage build AppImage and install to ~/.local/bin
#   ./install.sh --web      build the web bundle only (dist/), no installation
#
set -euo pipefail

MODE="desktop"
for arg in "$@"; do
    case "$arg" in
        --web) MODE="web" ;;
        --appimage) MODE="appimage" ;;
        -h|--help)
            echo "Usage: ./install.sh [--web | --appimage]"
            echo "  (default)   detect system, build the desktop app, install it"
            echo "  --appimage  force AppImage build, install to ~/.local/bin"
            echo "  --web       build the web bundle only (dist/)"
            exit 0
            ;;
        *) echo "Unknown option: $arg" >&2; exit 1 ;;
    esac
done

BLUE='\033[1;34m'
GREEN='\033[1;32m'
RED='\033[1;31m'
NC='\033[0m'
step() { echo -e "${BLUE}==>${NC} $1"; }
ok()   { echo -e "${GREEN} ✓${NC} $1"; }
fail() { echo -e "${RED} ✗${NC} $1" >&2; exit 1; }

cd "$(dirname "$0")"

step "Checking prerequisites"
command -v node >/dev/null 2>&1 || fail "node is required (https://nodejs.org)"
command -v npm >/dev/null 2>&1 || fail "npm is required (https://nodejs.org)"

if [ "$MODE" != "web" ]; then
    command -v rustc >/dev/null 2>&1 || fail "rustc is required — install via https://rustup.rs"
    command -v cargo >/dev/null 2>&1 || fail "cargo is required — install via https://rustup.rs"
fi

OS="$(uname)"
DISTRO="unknown"
PKG_MANAGER="none"
BUNDLE_TYPE="appimage"

if [ "$OS" = "Linux" ]; then
    if command -v apt-get >/dev/null 2>&1; then
        DISTRO="Debian/Ubuntu-based"
        PKG_MANAGER="apt"
        BUNDLE_TYPE="deb"
    elif command -v dnf >/dev/null 2>&1; then
        DISTRO="Fedora/RHEL-based"
        PKG_MANAGER="dnf"
        BUNDLE_TYPE="rpm"
    elif command -v zypper >/dev/null 2>&1; then
        DISTRO="openSUSE"
        PKG_MANAGER="zypper"
        BUNDLE_TYPE="rpm"
    elif command -v pacman >/dev/null 2>&1; then
        DISTRO="Arch-based"
        PKG_MANAGER="pacman"
        BUNDLE_TYPE="appimage"
    fi
    pkg-config --exists webkit2gtk-4.1 2>/dev/null ||
        fail "webkit2gtk-4.1 development files are required — see https://v2.tauri.app/start/prerequisites/"
elif [ "$OS" = "Darwin" ]; then
    DISTRO="macOS"
    PKG_MANAGER="none"
fi

if [ "$MODE" = "appimage" ]; then
    BUNDLE_TYPE="appimage"
fi

echo -e "  System:          ${OS}"
echo -e "  Distribution:    ${DISTRO}"
echo -e "  Package manager: ${PKG_MANAGER}"
echo -e "  Bundle type:     ${BUNDLE_TYPE}"
ok "prerequisites satisfied"

step "Installing dependencies"
if [ -f package-lock.json ]; then
    npm ci --no-fund || npm install --no-fund
else
    npm install --no-fund
fi
ok "dependencies installed"

if [ "$MODE" = "web" ]; then
    step "Building web bundle"
    npm run build
    ok "web bundle ready in ./dist — serve it with any static file server"
    exit 0
fi

step "Building desktop app (this compiles the Rust backend — first run takes a while)"

# Updater artifact signing: reuse the local key when present so local builds
# can produce signed update packages exactly like release CI does.
UPDATER_KEY="src-tauri/keys/updater.key"
if [ -f "$UPDATER_KEY" ]; then
    export TAURI_SIGNING_PRIVATE_KEY="$(cat "$UPDATER_KEY")"
    export TAURI_SIGNING_PRIVATE_KEY_PASSWORD="${TAURI_SIGNING_PRIVATE_KEY_PASSWORD:-}"
    ok "updater signing key found (${UPDATER_KEY})"
fi

# Arch and other rolling-release distros ship system libraries that the
# AppImage tooling cannot strip — skip stripping and extract instead of
# mounting via FUSE so the bundle works everywhere.
if [ "$OS" = "Linux" ]; then
    export NO_STRIP=true
    export APPIMAGE_EXTRACT_AND_RUN=1
    npm run tauri build -- --bundles "$BUNDLE_TYPE"
else
    npm run tauri build
fi

step "Installing"

find_newest() {
    find src-tauri/target/release/bundle -type f -name "$1" -exec ls -t {} + | head -n 1
}

case "$OS" in
    Linux)
        case "$BUNDLE_TYPE" in
            deb)
                DEB=$(find_newest "*.deb")
                ok "built $DEB"
                sudo apt-get install -y "$DEB"
                ok "installed — desktop entry and icons are registered automatically"
                ;;
            rpm)
                RPM=$(find_newest "*.rpm")
                ok "built $RPM"
                if command -v dnf >/dev/null 2>&1; then
                    sudo dnf install -y "$RPM"
                else
                    sudo yum install -y "$RPM"
                fi
                ok "installed — desktop entry and icons are registered automatically"
                ;;
            appimage)
                APPIMAGE=$(find_newest "*.AppImage")
                ok "built $APPIMAGE"
                mkdir -p "$HOME/.local/bin"
                cp "$APPIMAGE" "$HOME/.local/bin/yakuake-skin-generator"
                chmod +x "$HOME/.local/bin/yakuake-skin-generator"

                step "Creating desktop entry"
                mkdir -p "$HOME/.local/share/applications" "$HOME/.local/share/icons/hicolor/512x512/apps"
                cp public/PWA/android/launchericon-512x512.png \
                    "$HOME/.local/share/icons/hicolor/512x512/apps/yakuake-skin-generator.png"
                cat > "$HOME/.local/share/applications/yakuake-skin-generator.desktop" << DESKTOP_ENTRY
[Desktop Entry]
Version=1.0
Name=Yakuake Skin Generator
Comment=Create custom Yakuake terminal skins
Exec=$HOME/.local/bin/yakuake-skin-generator
Icon=yakuake-skin-generator
Type=Application
Categories=Development;Utility;
Terminal=false
StartupWMClass=yakuake-skin-generator
DESKTOP_ENTRY
                command -v update-desktop-database >/dev/null 2>&1 &&
                    update-desktop-database "$HOME/.local/share/applications" 2>/dev/null || true
                ok "desktop entry created — launch 'Yakuake Skin Generator' from your app menu"
                ;;
        esac
        ;;
    Darwin)
        APP=$(find src-tauri/target/release/bundle -type d -name "*.app" | head -n 1)
        ok "built $APP"
        rm -rf "/Applications/$(basename "$APP")"
        cp -R "$APP" /Applications/
        ok "installed to /Applications"
        ;;
esac

echo ""
echo -e "${GREEN}Done!${NC} Restart Yakuake after installing a skin to see it in the appearance list."
