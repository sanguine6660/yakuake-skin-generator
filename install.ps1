# Yakuake Skin Generator - build & install (Windows)
# Detects the toolchain, builds the desktop app and runs the installer.
#
# Usage:
#   .\install.ps1           build desktop app + run the installer
#   .\install.ps1 -Web      build the web bundle only (dist\), no installation

param(
    [switch]$Web
)

$ErrorActionPreference = "Stop"

function Step($message) { Write-Host "==> $message" -ForegroundColor Blue }
function Ok($message)   { Write-Host " [OK] $message" -ForegroundColor Green }
function Fail($message) { Write-Host " [FAIL] $message" -ForegroundColor Red; exit 1 }

Set-Location $PSScriptRoot

Step "Checking prerequisites"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Fail "node is required (https://nodejs.org)"
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Fail "npm is required (https://nodejs.org)"
}

if (-not $Web) {
    if (-not (Get-Command rustc -ErrorAction SilentlyContinue)) {
        Fail "rustc is required - install via https://rustup.rs"
    }
    if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) {
        Fail "cargo is required - install via https://rustup.rs"
    }
    Write-Host "  System: Windows"
    Write-Host "  Bundle: NSIS installer + MSI"
}
Ok "prerequisites satisfied"

Step "Installing dependencies"
npm install --no-fund
Ok "dependencies installed"

if ($Web) {
    Step "Building web bundle"
    npm run build
    Ok "web bundle ready in .\dist - serve it with any static file server"
    exit 0
}

Step "Building desktop app (this compiles the Rust backend - first run takes a while)"
npm run tauri build

Step "Installing"
$bundleDir = "src-tauri\target\release\bundle"

$nsis = Get-ChildItem "$bundleDir\nsis" -Filter "*.exe" -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
$msi = Get-ChildItem "$bundleDir\msi" -Filter "*.msi" -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1

if ($nsis) {
    Ok "built $($nsis.Name)"
    Step "Running the NSIS installer (per-user install)"
    Start-Process -FilePath $nsis.FullName -Wait
    Ok "installed - launch 'Yakuake Skin Generator' from the Start Menu"
} elseif ($msi) {
    Ok "built $($msi.Name)"
    Step "Running the MSI installer"
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i", "`"$($msi.FullName)`"" -Wait
    Ok "installed - launch 'Yakuake Skin Generator' from the Start Menu"
} else {
    Fail "No installer found under $bundleDir"
}

Write-Host ""
Write-Host "Done! Restart Yakuake after installing a skin to see it in the appearance list." -ForegroundColor Green
