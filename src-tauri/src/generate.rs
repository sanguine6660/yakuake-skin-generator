//! Skin asset and archive generation - a Rust port of the TypeScript
//! `svgGenerators` and `skinFileGenerator` modules, producing byte-identical
//! output for the same configuration.

use crate::colorscheme::{derive_colorscheme, generate_colorscheme_text};
use crate::config::SkinConfig;
use std::collections::BTreeMap;

fn sanitize_folder_name_for_file(name: &str) -> String {
    name.to_lowercase().replace(
        |c: char| !c.is_ascii_lowercase() && !c.is_ascii_digit() && c != '_' && c != '-',
        "_",
    )
}

pub const GENERATOR_VERSION: &str = env!("CARGO_PKG_VERSION");

pub fn adjust_hex_brightness(hex: &str, amount: i32) -> String {
    let clean = hex.trim_start_matches('#');
    let num = i32::from_str_radix(clean, 16).unwrap_or(0);
    let clamp = |v: i32| v.clamp(0, 255);
    let r = clamp((num >> 16) + amount);
    let g = clamp(((num >> 8) & 0xff) + amount);
    let b = clamp((num & 0xff) + amount);
    format!("#{r:02x}{g:02x}{b:02x}")
}

pub fn generate_background_center(color: &str, height: u32, translucent: bool) -> String {
    let opacity = if translucent { " opacity=\"0.85\"" } else { "" };
    format!(
        r#"<svg xmlns="http://www.w3.org/2000/svg" width="1" height="{height}"{opacity}><rect width="1" height="{height}" fill="{color}"/></svg>"#
    )
}

pub fn generate_background_left(
    color: &str,
    height: u32,
    radius: u32,
    translucent: bool,
) -> String {
    let opacity = if translucent { " opacity=\"0.85\"" } else { "" };
    let r = radius.min(8).min(height / 2);
    if r == 0 {
        return format!(
            r#"<svg xmlns="http://www.w3.org/2000/svg" width="8" height="{height}"{opacity}><rect width="8" height="{height}" fill="{color}"/></svg>"#
        );
    }
    format!(
        r#"<svg xmlns="http://www.w3.org/2000/svg" width="8" height="{height}"{opacity}><path d="M8,0 V{height} H{r} A{r},{r} 0 0,1 0,{hmr} V{r} A{r},{r} 0 0,1 {r},0 Z" fill="{color}"/></svg>"#,
        hmr = height - r
    )
}

pub fn generate_background_right(
    color: &str,
    height: u32,
    radius: u32,
    translucent: bool,
) -> String {
    let opacity = if translucent { " opacity=\"0.85\"" } else { "" };
    let r = radius.min(8).min(height / 2);
    if r == 0 {
        return format!(
            r#"<svg xmlns="http://www.w3.org/2000/svg" width="8" height="{height}"{opacity}><rect width="8" height="{height}" fill="{color}"/></svg>"#
        );
    }
    let wmr = 8 - r;
    format!(
        r#"<svg xmlns="http://www.w3.org/2000/svg" width="8" height="{height}"{opacity}><path d="M0,0 H{wmr} A{r},{r} 0 0,1 8,{r} V{hmr} A{r},{r} 0 0,1 {wmr},{height} H0 Z" fill="{color}"/></svg>"#,
        hmr = height - r
    )
}

pub fn generate_tab_piece(
    color: &str,
    width: u32,
    height: u32,
    radius: u32,
    is_left: bool,
    is_middle: bool,
) -> String {
    if is_middle {
        return format!(
            r#"<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}"><rect width="{width}" height="{height}" fill="{color}"/></svg>"#
        );
    }
    let r = radius.min(width).min(height / 2);
    if r == 0 {
        return format!(
            r#"<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}"><rect width="{width}" height="{height}" fill="{color}"/></svg>"#
        );
    }
    if is_left {
        format!(
            r#"<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}"><path d="M{width},0 V{height} H{r} A{r},{r} 0 0,1 0,{hmr} V{r} A{r},{r} 0 0,1 {r},0 Z" fill="{color}"/></svg>"#,
            hmr = height - r
        )
    } else {
        let wmr = width - r;
        format!(
            r#"<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}"><path d="M0,0 H{wmr} A{r},{r} 0 0,1 {width},{r} V{hmr} A{r},{r} 0 0,1 {wmr},{height} H0 Z" fill="{color}"/></svg>"#,
            hmr = height - r
        )
    }
}

/// Built-in fallback icon paths (24x24 space) used when the metadata
/// does not embed custom icon markup.
fn built_in_icon_path(name: &str) -> &'static str {
    match name {
        "maximize" => {
            r#"<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>"#
        }
        "close" => {
            r#"<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M18 6 6 18M6 6l12 12"/>"#
        }
        "plus" => {
            r#"<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"/>"#
        }
        "minus" => {
            r#"<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"/>"#
        }
        "lock" => {
            r#"<rect width="18" height="11" x="3" y="11" fill="none" stroke="currentColor" stroke-width="2" rx="2" ry="2"/><path fill="none" stroke="currentColor" stroke-width="2" d="M7 11V7a5 5 0 0 1 10 0v4"/>"#
        }
        "square" => {
            r#"<rect x="4.5" y="4.5" width="15" height="15" rx="2.5" fill="none" stroke="currentColor" stroke-width="2.5"/>"#
        }
        "x" => {
            r#"<path d="M6.5,6.5 L17.5,17.5 M17.5,6.5 L6.5,17.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>"#
        }
        _ => {
            r#"<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/>"#
        }
    }
}

fn generate_button_svg(
    icon_markup: Option<&str>,
    bg_color: &str,
    icon_color: &str,
    size: u32,
    icon_size: u32,
    is_circle: bool,
    fallback: &str,
) -> String {
    let icon_content = icon_markup.unwrap_or_else(|| built_in_icon_path(fallback));
    let scale = f64::from(icon_size) / 24.0;
    let translate = (f64::from(size) - 24.0 * scale) / 2.0;
    let shape = if is_circle {
        format!(
            r#"<circle cx="{}" cy="{}" r="{}" fill="{}"/>"#,
            size / 2,
            size / 2,
            size / 2 - 1,
            bg_color
        )
    } else {
        format!(r#"<rect width="{size}" height="{size}" rx="3" ry="3" fill="{bg_color}"/>"#)
    };
    let content = icon_content.replace("currentColor", icon_color);
    format!(
        r#"<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}">{shape}<g transform="translate({translate}, {translate}) scale({scale})">{content}</g></svg>"#
    )
}

pub struct GeneratedSkin {
    pub files: BTreeMap<String, String>,
}

pub fn generate_all(
    config: &SkinConfig,
    icon_markup: &dyn Fn(&str) -> Option<String>,
) -> BTreeMap<String, String> {
    let mut files = BTreeMap::new();
    let g = &config.global;
    let t = &config.title;
    let tabs = &config.tabs;

    // logo
    files.insert(
        "logo.svg".to_string(),
        format!(
            r#"<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <defs>
    <linearGradient id="ylogo-bg" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
      <stop stop-color="{}"/>
      <stop offset="1" stop-color="{}"/>
    </linearGradient>
    <linearGradient id="ylogo-accent" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
      <stop stop-color="{}"/>
      <stop offset="1" stop-color="{}"/>
    </linearGradient>
  </defs>
  <rect width="48" height="48" rx="11" fill="url(#ylogo-bg)"/>
  <rect x="1.25" y="1.25" width="45.5" height="45.5" rx="9.75" stroke="url(#ylogo-accent)" stroke-width="2.5"/>
  <path d="M16 12 L24 18.5 L32 12" stroke="url(#ylogo-accent)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M13.5 26 L20 31.5 L13.5 37" stroke="{}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M24.5 37 H35" stroke="{}" stroke-width="3.5" stroke-linecap="round"/>
</svg>"#,
            g.colors.selected,
            g.colors.bg,
            adjust_hex_brightness(&g.colors.text, 40),
            adjust_hex_brightness(&g.colors.text, -30),
            g.colors.text,
            g.colors.text
        ),
    );

    // title backgrounds
    // Mirrors the TypeScript generator: translucency is decided per bar
    // (global.translucency is a preview-only concern there).
    let title_translucent = t.bg_translucent;
    files.insert(
        "title/background_center.svg".into(),
        generate_background_center(&g.colors.bg, 28, title_translucent),
    );
    files.insert(
        "title/background_left.svg".into(),
        generate_background_left(&g.colors.bg, 28, g.border_radius as u32, title_translucent),
    );
    files.insert(
        "title/background_right.svg".into(),
        generate_background_right(&g.colors.bg, 28, g.border_radius as u32, title_translucent),
    );

    // title buttons
    let icon = |role: &str| icon_markup(role);
    for (prefix, state_colors, fallback, markup) in [
        (
            "config",
            &g.button_colors.config,
            "settings",
            icon("settings"),
        ),
        ("focus", &g.button_colors.focus, "square", icon("maximize")),
        ("quit", &g.button_colors.quit, "x", icon("close")),
    ] {
        for state in ["up", "over", "down"] {
            let (bg, ic) = match state {
                "up" => (state_colors.up_bg.as_str(), state_colors.up_icon.as_str()),
                "over" => (
                    state_colors.over_bg.as_str(),
                    state_colors.over_icon.as_str(),
                ),
                _ => (
                    state_colors.down_bg.as_str(),
                    state_colors.down_icon.as_str(),
                ),
            };
            files.insert(
                format!("title/{prefix}_{state}.svg"),
                generate_button_svg(markup.as_deref(), bg, ic, 20, 14, true, fallback),
            );
        }
    }

    // tabs backgrounds
    let tabs_translucent = tabs.bg_translucent;
    files.insert(
        "tabs/background_center.svg".into(),
        generate_background_center(&g.colors.bg, 28, tabs_translucent),
    );
    files.insert(
        "tabs/background_left.svg".into(),
        generate_background_left(&g.colors.bg, 28, g.border_radius as u32, tabs_translucent),
    );
    files.insert(
        "tabs/background_right.svg".into(),
        generate_background_right(&g.colors.bg, 28, g.border_radius as u32, tabs_translucent),
    );

    // tab pieces
    let radius = g.border_radius as u32;
    let selected = &g.colors.selected;
    let dim = &g.colors.dim;
    files.insert(
        "tabs/tab_selected.svg".into(),
        format!(
            r#"<svg xmlns="http://www.w3.org/2000/svg" width="120" height="28"><rect width="120" height="28" rx="{radius}" ry="{radius}" fill="{selected}"/></svg>"#
        ),
    );
    files.insert(
        "tabs/tab_unselected.svg".into(),
        format!(
            r#"<svg xmlns="http://www.w3.org/2000/svg" width="120" height="28"><rect width="120" height="28" rx="{radius}" ry="{radius}" fill="{dim}"/></svg>"#
        ),
    );
    files.insert(
        "tabs/tab_selected_left.svg".into(),
        generate_tab_piece(selected, 8, 28, radius, true, false),
    );
    files.insert(
        "tabs/tab_selected_middle.svg".into(),
        generate_tab_piece(selected, 104, 28, radius, false, true),
    );
    files.insert(
        "tabs/tab_selected_right.svg".into(),
        generate_tab_piece(selected, 8, 28, radius, false, false),
    );
    files.insert(
        "tabs/tab_unselected_left.svg".into(),
        generate_tab_piece(dim, 8, 28, radius, true, false),
    );
    files.insert(
        "tabs/tab_unselected_middle.svg".into(),
        generate_tab_piece(dim, 104, 28, radius, false, true),
    );
    files.insert(
        "tabs/tab_unselected_right.svg".into(),
        generate_tab_piece(dim, 8, 28, radius, false, false),
    );

    // separator
    if let Some(separator) = &tabs.separator_image {
        files.insert(
            "tabs/tab_separator.svg".into(),
            format!(
                r#"<svg xmlns="http://www.w3.org/2000/svg" width="1" height="28"><rect width="1" height="28" fill="{text}"/></svg>"#,
                text = g.colors.text
            ),
        );
        let _ = separator;
    }

    // lock
    let lock_markup = icon("lock");
    let lock_content = lock_markup
        .as_deref()
        .unwrap_or_else(|| built_in_icon_path("lock"))
        .replace("currentColor", &g.colors.text);
    files.insert(
        "tabs/lock.svg".into(),
        format!(
            r#"<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">{lock_content}</svg>"#
        ),
    );

    // tab bar buttons
    let plus_icon = icon("plus");
    let minus_icon = icon("minus");
    let close_icon = icon("close");
    for (prefix, state_colors, fallback, markup) in [
        ("plus", &g.button_colors.plus, "plus", plus_icon),
        ("minus", &g.button_colors.minus, "minus", minus_icon),
        ("close", &g.button_colors.close, "x", close_icon),
    ] {
        for state in ["up", "over", "down"] {
            let (bg, ic) = match state {
                "up" => (state_colors.up_bg.as_str(), state_colors.up_icon.as_str()),
                "over" => (
                    state_colors.over_bg.as_str(),
                    state_colors.over_icon.as_str(),
                ),
                _ => (
                    state_colors.down_bg.as_str(),
                    state_colors.down_icon.as_str(),
                ),
            };
            let icon_content = markup
                .as_deref()
                .unwrap_or_else(|| built_in_icon_path(fallback))
                .replace("currentColor", ic);
            files.insert(
                format!("tabs/{prefix}_{state}.svg"),
                format!(
                    r#"<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="3" ry="3" fill="{bg}"/><g transform="translate(2, 2) scale(0.5)">{icon_content}</g></svg>"#
                ),
            );
        }
    }

    files
}

fn write_button_config(
    prefix: &str,
    btn: &crate::config::ButtonConfig,
    include_anchor: bool,
    include_at_end_of_tabs: bool,
) -> Vec<String> {
    if !btn.enabled {
        return vec![];
    }
    let mut lines = vec![
        String::new(),
        format!("[{prefix}Button]"),
        format!("x={}", btn.x),
        format!("y={}", btn.y),
    ];
    if include_anchor {
        lines.push(format!(
            "anchor={}",
            btn.anchor.as_deref().unwrap_or("right")
        ));
    }
    lines.push(format!("up_image={}", btn.up));
    lines.push(format!("over_image={}", btn.over));
    lines.push(format!("down_image={}", btn.down));
    if include_at_end_of_tabs {
        lines.push(format!(
            "at_end_of_tabs={}",
            if btn.at_end_of_tabs.unwrap_or(false) {
                "true"
            } else {
                "false"
            }
        ));
    }
    lines
}

fn is_true(value: Option<bool>) -> &'static str {
    match value {
        Some(true) => "true",
        _ => "false",
    }
}

pub fn generate_title_skin(config: &SkinConfig) -> String {
    let meta = &config.meta;
    let title = &config.title;
    let mut lines = vec![
        "[Description]".to_string(),
        format!("Skin={}", meta.skin_name),
        format!("Author={}", meta.author),
        format!("Email={}", meta.email),
    ];
    if let Some(web) = &meta.web {
        if !web.is_empty() {
            lines.push(format!("Web={web}"));
        }
    }
    lines.extend([
        "Icon=/logo.svg".to_string(),
        String::new(),
        "[Border]".to_string(),
        format!("red={}", title.border_color.r),
        format!("green={}", title.border_color.g),
        format!("blue={}", title.border_color.b),
        format!("width={}", title.border_width),
        String::new(),
        "[Text]".to_string(),
        format!("x={}", title.text_x),
        format!("y={}", title.text_y),
        format!("red={}", title.text_color.r),
        format!("green={}", title.text_color.g),
        format!("blue={}", title.text_color.b),
        format!("text={}", title.text_content),
        format!("bold={}", title.text_bold),
        format!("centered={}", is_true(Some(title.centered))),
        String::new(),
        "[Background]".to_string(),
        format!("back_image={}", title.bg_center),
        format!("left_corner={}", title.bg_left),
        format!("right_corner={}", title.bg_right),
    ]);
    if title.title_enabled {
        lines.extend(write_button_config("Focus", &title.focus_btn, true, false));
        lines.extend(write_button_config(
            "Config",
            &title.config_btn,
            true,
            false,
        ));
        lines.extend(write_button_config("Quit", &title.quit_btn, true, false));
    }
    lines
        .into_iter()
        .filter(|l| !l.is_empty())
        .collect::<Vec<_>>()
        .join("\n")
}

pub fn generate_tabs_skin(config: &SkinConfig) -> String {
    let meta = &config.meta;
    let tabs = &config.tabs;
    let mut lines = vec![
        "[Description]".to_string(),
        format!("Skin={}", meta.skin_name),
        format!("Author={}", meta.author),
        format!("Email={}", meta.email),
    ];
    if let Some(web) = &meta.web {
        if !web.is_empty() {
            lines.push(format!("Web={web}"));
        }
    }
    lines.extend([
        "Icon=/logo.svg".to_string(),
        String::new(),
        "[Tabs]".to_string(),
        format!("x={}", tabs.tabs_x),
        format!("y={}", tabs.tabs_y),
        format!("red={}", tabs.selected_color.r),
        format!("green={}", tabs.selected_color.g),
        format!("blue={}", tabs.selected_color.b),
    ]);
    if let Some(separator) = &tabs.separator_image {
        if !separator.is_empty() {
            lines.push(format!("separator_image={separator}"));
        }
    }
    lines.extend([
        format!("selected_background={}", tabs.selected_middle),
        format!("selected_left_corner={}", tabs.selected_left),
        format!("selected_right_corner={}", tabs.selected_right),
        format!("unselected_background={}", tabs.unselected_middle),
        format!("unselected_left_corner={}", tabs.unselected_left),
        format!("unselected_right_corner={}", tabs.unselected_right),
        format!(
            "selected_text_bold={}",
            is_true(Some(tabs.selected_text_bold))
        ),
    ]);
    if tabs.tabs_enabled && tabs.lock_enabled && tabs.lock_btn.enabled {
        lines.extend([
            format!("prevent_closing_image={}", tabs.prevent_closing_image),
            format!("prevent_closing_image_x={}", tabs.lock_btn.x),
            format!("prevent_closing_image_y={}", tabs.prevent_closing_image_y),
        ]);
    }
    lines.push(format!("compact={}", is_true(Some(tabs.compact))));
    if tabs.tabs_enabled {
        lines.extend([
            String::new(),
            "[Background]".to_string(),
            format!("back_image={}", tabs.bg_center),
            format!("left_corner={}", tabs.bg_left),
            format!("right_corner={}", tabs.bg_right),
        ]);
        if tabs.plus_btn.enabled {
            lines.extend(write_button_config("Plus", &tabs.plus_btn, false, true));
        }
        if tabs.minus_btn.enabled {
            lines.extend(write_button_config("Minus", &tabs.minus_btn, false, false));
        }
        if tabs.close_btn.enabled {
            lines.extend(write_button_config("Close", &tabs.close_btn, false, false));
        }
    }
    lines
        .into_iter()
        .filter(|l| !l.is_empty())
        .collect::<Vec<_>>()
        .join("\n")
}

pub fn generate_license(config: &SkinConfig) -> String {
    format!(
        "Skin Name: {}\nAuthor: {}\nRepository / Source Code: https://github.com/sanguine6660/yakuake-skin-generator\nCreated with: Yakuake Skin Generator (https://github.com/sanguine6660/yakuake-skin-generator)\n\n\nLicense: Creative Commons Attribution 4.0 International (CC BY 4.0)\n\n\nYou are free to use, share, and adapt this skin for any purpose,\nprovided that you keep this copyright notice, attribute the original creator,\nand do not claim ownership of the original creation.\n",
        config.meta.skin_name, config.meta.author
    )
}

pub fn generate_skin_readme(config: &SkinConfig) -> String {
    let name = &config.meta.skin_name;
    let author = &config.meta.author;
    format!(
        "# {name} (Yakuake Skin)\n\nThis skin was custom-generated using the **Yakuake Skin Generator**.\n\n## Credits & Links\n* **Original Creator:** {author}\n* **Source Code & Editor:** [GitHub Repository](https://github.com/sanguine6660/yakuake-skin-generator)\n* **License:** CC BY 4.0\n\n---\n\n## About the Generator & How to Use\nWant to modify this skin, tweak its colors, swap icon sets, or design your own from scratch?\n\n1. Visit the online editor or clone the source repository:\n   👉 **[sanguine6660/yakuake-skin-generator](https://github.com/sanguine6660/yakuake-skin-generator)**\n2. Import this skin's JSON configuration file into the editor, or tweak the live parameters visually.\n3. Export a fresh `.tar.gz` bundle instantly!\n\n## Installation\nExtract this folder into your local Yakuake/KDE themes directory (usually `~/.local/share/yakuake/skins/` or system-wide equivalent), then select it from your Yakuake appearance settings.\n"
    )
}

/// Assembles every file of the skin archive, keyed by relative path.
pub fn prepare_skin_files(
    config: &SkinConfig,
    icon_markup: &dyn Fn(&str) -> Option<String>,
) -> BTreeMap<String, String> {
    use serde_json::json;

    let mut files = generate_all(config, icon_markup);

    files.insert("LICENSE".into(), generate_license(config));
    files.insert("README.md".into(), generate_skin_readme(config));

    let mut icons = serde_json::Map::new();
    for role in ["settings", "maximize", "close", "plus", "minus", "lock"] {
        if let Some(markup) = icon_markup(role) {
            icons.insert(role.to_string(), serde_json::Value::String(markup));
        }
    }

    let metadata = json!({
        "generator": {
            "name": "Yakuake Skin Generator",
            "url": "https://github.com/sanguine6660/yakuake-skin-generator",
            "version": GENERATOR_VERSION,
        },
        "skin": {
            "name": config.meta.skin_name,
            "author": config.meta.author,
            "email": config.meta.email,
            "web": config.meta.web,
            "icon": config.meta.icon,
            "license": "CC-BY-4.0",
            "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
            "repository": "https://github.com/sanguine6660/yakuake-skin-generator",
        },
        "config": {
            "note": "Full skin configuration state for re-importing into the editor",
            "data": {
                "global": config.global,
                "title": config.title,
                "tabs": config.tabs,
            },
            "icons": icons,
        },
    });
    files.insert(
        "metadata.json".into(),
        serde_json::to_string_pretty(&metadata).unwrap_or_default(),
    );

    files.insert("title.skin".into(), generate_title_skin(config));
    files.insert("tabs.skin".into(), generate_tabs_skin(config));

    // Companion Konsole scheme (derived when the config carries none).
    let scheme = config
        .terminal
        .clone()
        .unwrap_or_else(|| derive_colorscheme(config));
    files.insert(
        format!(
            "{}.colorscheme",
            sanitize_folder_name_for_file(&config.meta.skin_name)
        ),
        generate_colorscheme_text(&scheme),
    );

    files
}
