# Useful Links & Resources for Yakuake Skin Development

## Official Yakuake

- **Homepage / download**: https://apps.kde.org/yakuake/
- **Source repository (official)**: https://invent.kde.org/utilities/yakuake
- **GitHub mirror**: https://github.com/KDE/yakuake

## Source Files That Define The Skin Format

These are the ground truth for how skins are parsed and rendered (official
GitLab links; same files also on the GitHub mirror):

| File                                                                                          | Purpose                                                                               |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [`app/skin.cpp`](https://invent.kde.org/utilities/yakuake/-/blob/master/app/skin.cpp)         | Parses `title.skin` and `tabs.skin` — every key name, section and default value       |
| [`app/titlebar.cpp`](https://invent.kde.org/utilities/yakuake/-/blob/master/app/titlebar.cpp) | How the title bar is painted (tiled background, corners, text, button anchoring)      |
| [`app/tabbar.cpp`](https://invent.kde.org/utilities/yakuake/-/blob/master/app/tabbar.cpp)     | How tabs are painted (`drawTab`: corner → tiled background → corner, separator logic) |
| [`app/titlebar.h`](https://invent.kde.org/utilities/yakuake/-/blob/master/app/titlebar.h)     | Title bar class definition                                                            |
| [`app/tabbar.h`](https://invent.kde.org/utilities/yakuake/-/blob/master/app/tabbar.h)         | Tab bar class definition                                                              |

Raw file access (e.g. for scripting):

```text
https://invent.kde.org/utilities/yakuake/-/raw/master/app/skin.cpp
https://invent.kde.org/utilities/yakuake/-/raw/master/app/titlebar.cpp
https://invent.kde.org/utilities/yakuake/-/raw/master/app/tabbar.cpp
```

Mirror equivalent:

```text
https://raw.githubusercontent.com/KDE/yakuake/refs/heads/master/app/skin.cpp
https://raw.githubusercontent.com/KDE/yakuake/refs/heads/master/app/titlebar.cpp
https://raw.githubusercontent.com/KDE/yakuake/refs/heads/master/app/tabbar.cpp
```

## Key Rendering Facts (learned the hard way)

- Backgrounds (`back_image`, `selected_background`, `unselected_background`) are
  drawn with `drawTiledPixmap` — **tiled, never stretched**. Use 1px-wide
  vertical strips or plain rectangles for the middle pieces.
- Bar heights are determined by the **image height** of the background
  `back_image`.
- Title bar / tab bar buttons are real Qt buttons styled with stylesheets —
  images are used at their **natural pixel size** (up/over/down states).
- `PlusButton` x is from the left; `MinusButton` x is **from the right edge**;
  title bar buttons use `anchor=left|right` (default: right).
- SVGs are rendered by **Qt SVG**, which supports only the SVG Tiny 1.2 subset:
  https://doc.qt.io/qt-6/qtsvg.html — keep SVGs simple (rect/circle/path, no
  filters, no external refs, no CSS).

## Skins To Learn From (real-world examples)

- **KDE Store (search: yakuake)**: https://store.kde.org/search?term=yakuake
- The `ignored/` folder in this repo contains several downloaded skins (CachyOS,
  Monochrome, WhiteSur, Breeze variants, Sweet, Slot Dark, FlatGhost) that are
  excellent format references.

## Related

- **Konsole color schemes** (`.colorscheme` files — control terminal colors, not
  the skin): https://docs.kde.org/stable/en/konsole/konsole/index.html
- **Yakuake bug tracker**:
  https://bugs.kde.org/buglist.cgi?product=yakuake&resolution=---
- **KDE visual design group** (Plasma styling community):
  https://community.kde.org/KDE_Visual_Design_Group
