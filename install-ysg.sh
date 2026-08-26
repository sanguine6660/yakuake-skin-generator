#!/usr/bin/env bash
#
# Yakuake Skin Generator - remote release installer
# Detects OS, architecture and distribution, downloads the matching bundle
# from the latest GitHub release, verifies its SHA256 checksum and installs it.
# No repository checkout, Node.js or Rust toolchain required.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/sanguine6660/yakuake-skin-generator/main/install-ysg.sh | bash
#   ./install-ysg.sh                      install the latest release
#   ./install-ysg.sh --appimage           force the AppImage bundle (~/.local/bin)
#   ./install-ysg.sh --version 1.2.0      pin a specific release
#   ./install-ysg.sh --dry-run            resolve + verify only, install nothing
#   ./install-ysg.sh --help
#
set -euo pipefail

REPO="sanguine6660/yakuake-skin-generator"
RELEASES_URL="https://github.com/${REPO}/releases"
RAW_ICON_URL="https://raw.githubusercontent.com/${REPO}/main/public/PWA/android/launchericon-512x512.png"
BIN_NAME="yakuake-skin-generator"
APPIMAGE_DIR="${HOME}/.local/bin"
DESKTOP_DIR="${HOME}/.local/share/applications"
ICON_DIR="${HOME}/.local/share/icons/hicolor/512x512/apps"

TAG=""
FORCE_APPIMAGE=false
DRY_RUN=false

BLUE='\033[1;34m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
NC='\033[0m'
step() { echo -e "${BLUE}==>${NC} $1"; }
ok()   { echo -e "${GREEN} ✓${NC} $1"; }
warn() { echo -e "${YELLOW} !${NC} $1"; }
fail() { echo -e "${RED} ✗${NC} $1" >&2; exit 1; }

usage() {
    cat << USAGE
Usage: ./install-ysg.sh [--appimage] [--version X.Y.Z] [--dry-run]

  (default)     detect system, download the latest release bundle, install it
  --appimage    force the AppImage bundle, install to ${APPIMAGE_DIR}
  --version     pin a release tag (with or without the leading "v")
  --dry-run     resolve the matching asset and verify it, install nothing

When piping from curl, pass options to bash:
  curl -fsSL https://raw.githubusercontent.com/${REPO}/main/install-ysg.sh | bash -s -- --appimage
USAGE
}

while [ $# -gt 0 ]; do
    case "$1" in
        --appimage) FORCE_APPIMAGE=true ;;
        --version)
            [ $# -ge 2 ] || fail "--version requires a value"
            shift
            TAG="v${1#v}"
            ;;
        --dry-run) DRY_RUN=true ;;
        -h|--help) usage; exit 0 ;;
        *) usage >&2; fail "unknown option: $1" ;;
    esac
    shift

done

# ---------------------------------------------------------------- downloader --

HAVE_CURL=false
HAVE_WGET=false
command -v curl >/dev/null 2>&1 && HAVE_CURL=true
command -v wget >/dev/null 2>&1 && HAVE_WGET=true
$HAVE_CURL || $HAVE_WGET || fail "curl or wget is required"

fetch() { # fetch <url> -> stdout
    if $HAVE_CURL; then curl -fsSL --retry 3 "$1"; else wget -qO- "$1"; fi
}

fetch_to() { # fetch_to <url> <file>
    if $HAVE_CURL; then curl -fsSL --retry 3 --progress-bar -o "$2" "$1"; else wget -qO "$2" "$1"; fi
}

# --------------------------------------------------------------- detection ----

OS="$(uname -s)"
ARCH="$(uname -m)"
DISTRO="unknown"
BUNDLE=""

case "$OS" in
    Linux)
        if command -v apt-get >/dev/null 2>&1; then
            DISTRO="Debian/Ubuntu-based"; BUNDLE="deb"
        elif command -v dnf >/dev/null 2>&1; then
            DISTRO="Fedora/RHEL-based"; BUNDLE="rpm"
        elif command -v yum >/dev/null 2>&1; then
            DISTRO="Fedora/RHEL-based"; BUNDLE="rpm"
        elif command -v zypper >/dev/null 2>&1; then
            DISTRO="openSUSE"; BUNDLE="rpm"
        elif command -v pacman >/dev/null 2>&1; then
            DISTRO="Arch-based"; BUNDLE="appimage"
        else
            DISTRO="generic Linux"; BUNDLE="appimage"
        fi
        ;;
    Darwin)
        DISTRO="macOS"; BUNDLE="dmg"
        ;;
    MINGW* | MSYS* | CYGWIN* | Windows_NT)
        fail "Windows is not supported by this installer — grab .msi or -setup.exe from ${RELEASES_URL}"
        ;;
    *)
        fail "unsupported OS: ${OS} — grab a bundle from ${RELEASES_URL}"
        ;;
esac

case "$ARCH" in
    x86_64 | amd64)
        DEB_ARCH="amd64"; RPM_ARCH="x86_64"; DMG_ARCH="x64"; APPIMAGE_PATTERN='_(amd64|x86_64)\.AppImage'
        ;;
    aarch64 | arm64)
        DEB_ARCH="arm64"; RPM_ARCH="aarch64"; DMG_ARCH="aarch64"; APPIMAGE_PATTERN='_aarch64\.AppImage'
        ;;
    *)
        fail "unsupported architecture: ${ARCH}"
        ;;
esac

$FORCE_APPIMAGE && [ "$OS" = "Linux" ] && BUNDLE="appimage"

echo -e "  System:          ${OS}"
echo -e "  Architecture:    ${ARCH}"
echo -e "  Distribution:    ${DISTRO}"
echo -e "  Bundle type:     ${BUNDLE}"

# ------------------------------------------------------------ release lookup --

step "Resolving ${TAG:-latest} release"
RELEASE_JSON="$(fetch "https://api.github.com/repos/${REPO}/releases/${TAG:+tags/}${TAG:-latest}")" ||
    fail "could not reach the GitHub API — check your connection or browse ${RELEASES_URL}"

asset_urls() {
    printf '%s\n' "$RELEASE_JSON" |
        grep '"browser_download_url"' |
        sed -e 's/.*: *"//' -e 's/",*$//' -e 's/"$//'
}

RELEASE_TAG="$(printf '%s\n' "$RELEASE_JSON" | sed -n 's/.*"tag_name": *"\([^"]*\)".*/\1/p' | head -n 1)"
[ -n "$RELEASE_TAG" ] || fail "could not parse the release — browse ${RELEASES_URL}"

pick_asset() { # pick_asset <anchored-egrep-suffix> <friendly-name>
    local url
    url="$(asset_urls | grep -E "$1\$" | head -n 1 || true)"
    [ -n "$url" ] || {
        echo -e "  no ${2} asset in ${RELEASE_TAG} — available assets:" >&2
        asset_urls | sed 's/^/    /' >&2
        fail "no matching asset for this system — grab one manually from ${RELEASES_URL}"
    }
    printf '%s\n' "$url"
}

case "$BUNDLE" in
    deb) ASSET_URL="$(pick_asset "_${DEB_ARCH}\.deb" ".deb (${DEB_ARCH})")" ;;
    rpm) ASSET_URL="$(pick_asset "\.${RPM_ARCH}\.rpm" ".rpm (${RPM_ARCH})")" ;;
    appimage) ASSET_URL="$(pick_asset "${APPIMAGE_PATTERN}" "AppImage (${ARCH})")" ;;
    dmg) ASSET_URL="$(pick_asset "_${DMG_ARCH}\.dmg" ".dmg (${DMG_ARCH})")" ;;
esac

ASSET_FILE="${ASSET_URL##*/}"
ok "${RELEASE_TAG} → ${ASSET_FILE}"

# ---------------------------------------------------------------- download ----

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT
cd "$TMP_DIR"

SUMS_URL="$(asset_urls | grep -E 'SHA256SUMS\.txt$' | head -n 1 || true)"

if $DRY_RUN; then
    step "Dry run — skipping download"
    echo -e "  would download: ${ASSET_URL}"
    [ -n "$SUMS_URL" ] && echo -e "  would verify:   ${SUMS_URL}"
    ok "asset available, system supported — nothing was installed"
    exit 0
fi

step "Downloading ${ASSET_FILE}"
fetch_to "${ASSET_URL}" "${TMP_DIR}/${ASSET_FILE}"
ok "downloaded $(du -h "${ASSET_FILE}" | cut -f1)"

verify_checksum() {
    local actual expected
    [ -n "$SUMS_URL" ] || { warn "release has no SHA256SUMS.txt — skipping verification"; return 0; }
    fetch_to "$SUMS_URL" "$TMP_DIR/SHA256SUMS.txt"
    expected="$(grep -F -- "  ${ASSET_FILE}" "$TMP_DIR/SHA256SUMS.txt" | awk '{print $1}' | head -n 1 || true)"
    [ -n "$expected" ] || { warn "no checksum entry for ${ASSET_FILE} — skipping verification"; return 0; }
    if command -v sha256sum >/dev/null 2>&1; then
        actual="$(sha256sum "${ASSET_FILE}" | awk '{print $1}')"
    elif command -v shasum >/dev/null 2>&1; then
        actual="$(shasum -a 256 "${ASSET_FILE}" | awk '{print $1}')"
    else
        warn "no sha256 tool found — skipping verification"
        return 0
    fi
    [ "$actual" = "$expected" ] || fail "checksum mismatch for ${ASSET_FILE} (expected ${expected}, got ${actual})"
    ok "checksum verified"
}

step "Verifying checksum"
verify_checksum

# --------------------------------------------------------------- privilege ----

SUDO=""
if [ "$(id -u)" -ne 0 ] && command -v sudo >/dev/null 2>&1; then
    SUDO="sudo"
fi

# ----------------------------------------------------------------- install ----

step "Installing ${BUNDLE} bundle"

case "$BUNDLE" in
    deb)
        [ -n "$SUDO" ] || [ "$(id -u)" -eq 0 ] || fail "root privileges required — rerun with sudo"
        $SUDO apt-get install -y "${TMP_DIR}/${ASSET_FILE}"
        ok "installed — desktop entry and icons are registered automatically"
        ;;
    rpm)
        [ -n "$SUDO" ] || [ "$(id -u)" -eq 0 ] || fail "root privileges required — rerun with sudo"
        if command -v dnf >/dev/null 2>&1; then
            $SUDO dnf install -y "${TMP_DIR}/${ASSET_FILE}"
        elif command -v yum >/dev/null 2>&1; then
            $SUDO yum install -y "${TMP_DIR}/${ASSET_FILE}"
        else
            $SUDO zypper --non-interactive install "${TMP_DIR}/${ASSET_FILE}"
        fi
        ok "installed — desktop entry and icons are registered automatically"
        ;;
    appimage)
        mkdir -p "$APPIMAGE_DIR"
        cp "${TMP_DIR}/${ASSET_FILE}" "${APPIMAGE_DIR}/${BIN_NAME}"
        chmod +x "${APPIMAGE_DIR}/${BIN_NAME}"
        ok "installed to ${APPIMAGE_DIR}/${BIN_NAME}"

        step "Creating desktop entry"
        mkdir -p "$DESKTOP_DIR" "$ICON_DIR"
        if fetch_to "$RAW_ICON_URL" "${ICON_DIR}/${BIN_NAME}.png" 2>/dev/null; then
            ok "icon downloaded"
        else
            warn "could not download icon — the AppImage still works"
        fi
        cat > "${DESKTOP_DIR}/${BIN_NAME}.desktop" << DESKTOP_ENTRY
[Desktop Entry]
Version=1.0
Name=Yakuake Skin Generator
Comment=Create custom Yakuake terminal skins
Exec=${APPIMAGE_DIR}/${BIN_NAME}
Icon=${BIN_NAME}
Type=Application
Categories=Development;Utility;
Terminal=false
StartupWMClass=${BIN_NAME}
DESKTOP_ENTRY
        command -v update-desktop-database >/dev/null 2>&1 &&
            update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true
        ok "desktop entry created — launch 'Yakuake Skin Generator' from your app menu"

        case ":${PATH}:" in
            *":${APPIMAGE_DIR}:"*) ;;
            *) warn "${APPIMAGE_DIR} is not in your PATH — add it to your shell profile" ;;
        esac
        ;;
    dmg)
        MNT="$(hdiutil attach -nobrowse -readonly -quiet "${TMP_DIR}/${ASSET_FILE}" |
            sed -n 's/.*\(\/Volumes\/.*\)/\1/p' | tail -n 1)"
        [ -n "$MNT" ] || fail "could not mount ${ASSET_FILE}"
        APP="$(find "$MNT" -maxdepth 1 -name '*.app' | head -n 1)"
        [ -n "$APP" ] || { hdiutil detach "$MNT" -quiet || true; fail "no .app inside ${ASSET_FILE}"; }
        if [ -w /Applications ]; then
            rm -rf "/Applications/$(basename "$APP")"
            cp -R "$APP" /Applications/
        else
            [ -n "$SUDO" ] || fail "cannot write to /Applications — rerun with sudo"
            $SUDO rm -rf "/Applications/$(basename "$APP")"
            $SUDO cp -R "$APP" /Applications/
        fi
        hdiutil detach "$MNT" -quiet || true
        ok "installed to /Applications/$(basename "$APP")"
        ;;
esac

echo ""
echo -e "${GREEN}Done!${NC} Installed ${RELEASE_TAG} — restart Yakuake after installing a skin to see it in the appearance list."
