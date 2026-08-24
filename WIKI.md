# Yakuake Skin Format — Wiki

Complete reference for creating custom Yakuake skins. Verified against the
[Yakuake source code](https://invent.kde.org/utilities/yakuake) (`app/skin.cpp`,
`app/titlebar.cpp`, `app/tabbar.cpp`).

A skin is a folder containing two INI-style config files (`title.skin`,
`tabs.skin`) plus the images they reference (SVG or PNG).

---

## Folder Structure

```text
my-skin/
├── logo.svg              # shown in the skin selector
├── title.skin            # title bar (bottom bar) config
├── tabs.skin             # tab bar (top bar) config
├── title/                # title bar images
│   ├── back_image.svg        tiled background
│   ├── left_corner.svg       window corner (alpha = window mask)
│   ├── right_corner.svg
│   ├── focus_up.svg          buttons: up / over (hover) / down (pressed)
│   ├── focus_over.svg
│   ├── focus_down.svg
│   ├── config_up.svg
│   ├── config_over.svg
│   ├── config_down.svg
│   ├── quit_up.svg
│   ├── quit_over.svg
│   └── quit_down.svg
└── tabs/                 # tab bar images
    ├── back_image.svg        tiled bar background
    ├── left_corner.svg
    ├── right_corner.svg
    ├── selected_back.svg     tiled selected-tab background
    ├── unselected_back.svg   tiled unselected-tab background
    ├── selected_left.svg     optional tab corner pieces
    ├── selected_right.svg
    ├── unselected_left.svg
    ├── unselected_right.svg
    ├── separator.svg         separator between unselected tabs
    ├── lock.svg              "prevent closing" indicator
    ├── plus_up.svg           new-tab button (up/over/down)
    ├── plus_over.svg
    ├── plus_down.svg
    ├── minus_up.svg          tab-bar close button (up/over/down)
    ├── minus_over.svg
    └── minus_down.svg
```

---

## Rendering Rules (important!)

| Rule                                | Detail                                                                                                                                                           |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backgrounds tile, never stretch** | `back_image`, `selected_background`, `unselected_background` are drawn with `drawTiledPixmap`. Use a 1px-wide vertical strip (e.g. `1×28`) or a plain rectangle. |
| **Bar height = image height**       | The title bar and tab bar heights come from the height of their `back_image`. A `28px` tall image → `28px` bar.                                                  |
| **Buttons use natural image size**  | Buttons are real Qt buttons styled with stylesheets; the up/over/down images define the button size (`min-width`/`max-width` = image size).                      |
| **Corners keep natural size**       | Corner images are drawn as-is at the edges. Their **alpha channel masks the window** (title bar corners).                                                        |
| **SVG support = Qt SVG subset**     | Only SVG Tiny 1.2 features: `rect`, `circle`, `path`, basic gradients. No filters, no CSS, no external references.                                               |
| **Tab text color is single**        | One `red/green/blue` for all tab labels (in `[Tabs]`). There is no separate unselected color — differentiate via the unselected background.                      |

---

## title.skin

### `[Description]`

| Key      | Default | Description                            |
| -------- | ------- | -------------------------------------- |
| `Skin`   | —       | Name shown in the skin selector        |
| `Author` | —       | Author name                            |
| `Email`  | —       | Author email                           |
| `Web`    | —       | Optional website                       |
| `Icon`   | —       | Skin icon, relative to the skin folder |

### `[Background]`

| Key            | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| `back_image`   | Tiled background — **its height sets the title bar height** |
| `left_corner`  | Left window corner (alpha shapes the window mask)           |
| `right_corner` | Right window corner                                         |

### `[Border]`

| Key                      | Default | Description                        |
| ------------------------ | ------- | ---------------------------------- |
| `red` / `green` / `blue` | `0`     | Border color (separate keys)       |
| `width`                  | `1`     | Border thickness in px, `0` = none |

### `[Text]`

| Key                      | Default | Description                                                      |
| ------------------------ | ------- | ---------------------------------------------------------------- |
| `text`                   | —       | Static text appended to the session title (`<session> - <text>`) |
| `x` / `y`                | `0`     | Text position inside the bar                                     |
| `red` / `green` / `blue` | `0`     | Text color (separate keys)                                       |
| `bold`                   | `true`  | Bold text                                                        |
| `centered`               | `false` | Center horizontally when it fits                                 |

### `[FocusButton]` / `[ConfigButton]` / `[QuitButton]`

| Key          | Default | Description                                          |
| ------------ | ------- | ---------------------------------------------------- |
| `x` / `y`    | `0`     | Button position; `x` measured from the `anchor` side |
| `anchor`     | `right` | `left` or `right`                                    |
| `up_image`   | —       | Normal state                                         |
| `over_image` | —       | Hover state                                          |
| `down_image` | —       | Pressed state                                        |

- **Focus** = "keep window open" toggle
- **Config** = menu button
- **Quit** = close Yakuake

---

## tabs.skin

### `[Description]`

Same keys as `title.skin`.

### `[Tabs]`

| Key                       | Default     | Description                                                                             |
| ------------------------- | ----------- | --------------------------------------------------------------------------------------- |
| `x` / `y`                 | `0`         | Where the tabs start inside the bar                                                     |
| `red` / `green` / `blue`  | `0`         | Tab label color (**single color for all tabs**)                                         |
| `selected_background`     | —           | Tiled background of the selected tab                                                    |
| `unselected_background`   | —           | Tiled background of unselected tabs                                                     |
| `selected_left_corner`    | —           | Optional corner piece at the selected tab's left edge                                   |
| `selected_right_corner`   | —           | Optional corner piece at the selected tab's right edge                                  |
| `unselected_left_corner`  | —           | Optional; replaces the separator on unselected tabs                                     |
| `unselected_right_corner` | —           | Optional                                                                                |
| `separator_image`         | —           | Vertical separator between unselected tabs (used only when no unselected corners exist) |
| `selected_text_bold`      | `true`      | Bold label on the selected tab                                                          |
| `prevent_closing_image`   | system icon | Lock icon for "prevent closing" tabs                                                    |
| `prevent_closing_image_x` | `0`         | Lock icon x offset inside the tab                                                       |
| `prevent_closing_image_y` | `0`         | Lock icon y offset                                                                      |
| `compact`                 | `false`     | Compact tab bar mode                                                                    |

**Tab composition** (per `drawTab()`): `[left corner]` →
`[tiled background, width = text + 10px]` → `[right corner]`. Unselected tabs
get separators between them when no unselected corners are set.

### `[Background]`

| Key                            | Description                                                   |
| ------------------------------ | ------------------------------------------------------------- |
| `back_image`                   | Tiled bar background — **its height sets the tab bar height** |
| `left_corner` / `right_corner` | Bar end pieces                                                |

### `[PlusButton]` (new tab)

| Key                                      | Default | Description                                     |
| ---------------------------------------- | ------- | ----------------------------------------------- |
| `x` / `y`                                | `0`     | Position, `x` from the **left**                 |
| `up_image` / `over_image` / `down_image` | —       | Button states                                   |
| `at_end_of_tabs`                         | `false` | Follow the last tab instead of a fixed position |

### `[MinusButton]` (tab-bar close button)

| Key                                      | Default | Description                                    |
| ---------------------------------------- | ------- | ---------------------------------------------- |
| `x` / `y`                                | `0`     | Position, `x` measured **from the right edge** |
| `up_image` / `over_image` / `down_image` | —       | Button states                                  |

---

## Installation

Copy the skin folder to:

```bash
~/.local/share/yakuake/skins/
```

Then in Yakuake: right-click the title bar → **Configure Yakuake…** →
**Appearance** → select the skin → **Apply**. Restart Yakuake if it doesn't show
up (`killall yakuake && yakuake &`).

---

## Terminal Colors (not part of the skin)

The skin only styles the bars and buttons. Terminal colors (ANSI palette,
background, opacity) are **Konsole color schemes** (`.colorscheme` files) — see
`skin_reference/name.colorscheme.reference`.

---

## Resources

See [`skin_reference/LINKS.md`](skin_reference/LINKS.md) for source links and
real-world example skins.
