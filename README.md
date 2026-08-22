# Yakuake Skin Generator 🎨

[![Deploy to GitHub Pages](https://github.com/sanguine6660/yakuake-skin-generator/actions/workflows/deploy.yml/badge.svg)](https://github.com/sanguine6660/yakuake-skin-generator/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://sanguine6660.github.io/yakuake-skin-generator/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, full-featured web application to create custom Yakuake terminal skins
with all possible configuration options. Built with Preact, TypeScript, and
Tailwind CSS.

## Features

### Core Functionality

- **Complete Skin Configuration** - Configure every aspect of Yakuake skins
  (title bar, tabs bar, colors, icons, positions)
- **28 Icon Libraries** - Lucide, Font Awesome 5/6, Ionicons, Material Design,
  Bootstrap Icons, Tabler, Phosphor, and more
- **Per-Icon Customization** - 6 icon roles (settings, maximize, close, plus,
  minus, lock) each selectable from any library
- **Full Color Palette** - Background, selected/accent, text, dim with hex +
  color picker + RGB inputs
- **Advanced Features** - Separator images, selected/unselected tab corners,
  translucency support, border width/color
- **Real-time Preview** - Accurate Yakuake rendering preview (tabs on top, title
  bar on bottom)
- **Export** - Generates a proper `.tar.gz` archive with all required files for
  instant Yakuake installation

### New Features

- **20 Modern Presets** (10 Dark + 10 Light)
    - **Dark**: Midnight, Dracula, Nord, Tokyo Night, Catppuccin Mocha, Rose
      Pine, Gruvbox, Everforest, Kanagawa, GitHub Dark
    - **Light**: GitHub Light, Catppuccin Latte, Rose Pine Dawn, Catppuccin
      Frappé, Tokyo Day, Everforest Light, Kanagawa Light, Nord Light, Gruvbox
      Light, Solarized Light
- **Dark/Light Preset Categories** - Easy switching between themes
- **Direct Install to Yakuake** - One-click install to
  `~/.local/share/yakuake/skins/` using File System Access API
  (Chrome/Edge/Brave)
- **Button Visibility Toggles** - Enable/disable each button (Config, Focus,
  Quit, Lock, Plus, Minus) - disabled buttons are omitted from the skin file
- **Icon Preview in Dropdowns** - Hover shows icon preview, dropdown shows 120+
  icons with live previews
- **Generator Branding** - Custom logo in favicon, navbar, and exported
  `logo.svg`
- **Tabbed Interface** - Global → Title Bar → Tabs Bar → Export → Metadata
- **Detailed Installation Guide** - Step-by-step guide at bottom of Export tab

## Quick Start

```bash
# Clone the repository
git clone https://github.com/sanguine6660/yakuake-skin-generator.git
cd yakuake-skin-generator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Skin Structure

Generated skins follow the official Yakuake skin format:

```text
skin-name/
├── logo.svg
├── title.skin
├── tabs.skin
├── title/
│   ├── background_center.svg
│   ├── background_left.svg
│   ├── background_right.svg
│   ├── config_up.svg
│   ├── config_over.svg
│   ├── config_down.svg
│   ├── focus_up.svg
│   ├── focus_over.svg
│   ├── focus_down.svg
│   ├── quit_up.svg
│   ├── quit_over.svg
│   └── quit_down.svg
└── tabs/
    ├── background_center.svg
    ├── background_left.svg
    ├── background_right.svg
    ├── tab_selected.svg
    ├── tab_unselected.svg
    ├── tab_selected_left.svg
    ├── tab_selected_right.svg
    ├── tab_unselected_left.svg
    ├── tab_unselected_right.svg
    ├── tab_separator.svg
    ├── lock.svg
    ├── plus_up.svg
    ├── plus_over.svg
    ├── plus_down.svg
    ├── minus_up.svg
    ├── minus_over.svg
    └── minus_down.svg
```

## Installation

### Auto-Install (Recommended - Chrome/Edge/Brave)

1. Click **"Install to Yakuake"** in the Export tab
2. Select `~/.local/share/yakuake/skins/` folder
3. Done! The skin is installed and ready to use

### Manual Install

1. Click **"Download .tar.gz"** in the Export tab
2. Extract the archive to `~/.local/share/yakuake/skins/`
3. In Yakuake: Go to **Settings** → **Configure Skin** → **New...** → Select the
   skin
4. Apply and enjoy!

## Configuration Options

### Global (Tab 1)

- **Presets** - 20 modern presets (10 Dark + 10 Light) with category tabs
- **Icon Library** - 28 libraries (Lucide, Font Awesome 5/6, Ionicons, Material
  Design, Bootstrap, Tabler, Phosphor, etc.)
- **Per-Role Icons** - Settings, Maximize, Close, Plus, Minus, Lock
- **Color Palette** - Background, Selected/Accent, Text, Dim with hex + picker +
  RGB
- **Border Radius, Opacity, Translucency** toggles
- **Website** field

### Title Bar (Tab 2)

- Border color & width
- Text position, color, content, bold
- Background (center, left, right) with translucency
- **Button Visibility** - Enable/disable Config, Focus/Maximize, Quit buttons
- Button positions (Config, Focus/Maximize, Quit) - all 3 states (up/over/down)

### Tabs Bar (Tab 3)

- Tabs position (X, Y)
- Text color
- Separator image
- Selected tab background + corners (left/right)
- Unselected tab background + corners (left/right)
- Lock icon position & visibility toggle
- Background with translucency
- **Button Visibility** - Enable/disable Plus/Minus buttons
- Plus/Minus button positions - all 3 states

### Export (Tab 4)

- **Install to Yakuake** - Direct install to `~/.local/share/yakuake/skins/`
- **Download .tar.gz** - Manual install option
- Detailed 4-step installation guide
- Installation status notifications

### Metadata (Tab 5)

- Skin name, Author, Email
- Auto-filled from presets (sanguine6660, sanguine6660@gmail.com, GitHub URL)

## Tech Stack

- **Preact** - Fast 3kB React alternative
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **Vite** - Lightning-fast build tool
- **react-icons** - 28 icon library integrations

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the
[issues page](https://github.com/sanguine6660/yakuake-skin-generator/issues).

## License

Distributed under the MIT License. See `LICENSE` for more information.
