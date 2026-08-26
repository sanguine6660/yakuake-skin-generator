//! Skin configuration model mirroring the TypeScript `SkinConfig` type,
//! with serde defaults matching the generator's default configuration.

use serde::{Deserialize, Serialize};

pub fn default_true() -> bool {
    true
}

fn default_skin_name() -> String {
    "My Custom Skin".into()
}

fn default_author() -> String {
    "Your Name".into()
}

fn default_email() -> String {
    "you@example.com".into()
}

fn default_icon() -> String {
    "/logo.svg".into()
}

fn default_title_text() -> String {
    "My Custom Skin".into()
}

fn default_title_x() -> i32 {
    14
}

fn default_title_y() -> i32 {
    18
}

#[derive(Serialize, Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase", default)]
pub struct RgbColor {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase", default)]
pub struct SkinMeta {
    pub skin_name: String,
    pub author: String,
    pub email: String,
    pub web: Option<String>,
    pub icon: String,
}

impl Default for SkinMeta {
    fn default() -> Self {
        SkinMeta {
            skin_name: default_skin_name(),
            author: default_author(),
            email: default_email(),
            web: Some("https://github.com/sanguine6660/yakuake-skin-generator".into()),
            icon: default_icon(),
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase", default)]
pub struct ButtonConfig {
    pub enabled: bool,
    pub x: i32,
    pub y: i32,
    /// Title buttons only: side from which `x` is measured (`left`/`right`).
    pub anchor: Option<String>,
    /// PlusButton only: follow the last tab instead of a fixed position.
    pub at_end_of_tabs: Option<bool>,
    pub up: String,
    pub over: String,
    pub down: String,
}

impl Default for ButtonConfig {
    fn default() -> Self {
        ButtonConfig {
            enabled: true,
            x: 0,
            y: 0,
            anchor: None,
            at_end_of_tabs: None,
            up: String::new(),
            over: String::new(),
            down: String::new(),
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase", default)]
pub struct TitleConfig {
    pub border_color: RgbColor,
    pub border_width: i32,
    pub text_x: i32,
    pub text_y: i32,
    pub text_color: RgbColor,
    pub text_content: String,
    #[serde(default = "default_true")]
    pub text_bold: bool,
    pub centered: bool,
    pub bg_center: String,
    pub bg_left: String,
    pub bg_right: String,
    pub bg_translucent: bool,
    #[serde(default = "default_true")]
    pub title_enabled: bool,
    pub focus_btn: ButtonConfig,
    pub config_btn: ButtonConfig,
    pub quit_btn: ButtonConfig,
}

impl Default for TitleConfig {
    fn default() -> Self {
        TitleConfig {
            border_color: RgbColor::default(),
            border_width: 0,
            text_x: default_title_x(),
            text_y: default_title_y(),
            text_color: RgbColor {
                r: 102,
                g: 194,
                b: 242,
            },
            text_content: default_title_text(),
            text_bold: true,
            centered: false,
            bg_center: "/title/background_center.svg".into(),
            bg_left: "/title/background_left.svg".into(),
            bg_right: "/title/background_right.svg".into(),
            bg_translucent: false,
            title_enabled: true,
            focus_btn: ButtonConfig {
                x: 88,
                y: 4,
                up: "/title/focus_up.svg".into(),
                over: "/title/focus_over.svg".into(),
                down: "/title/focus_down.svg".into(),
                ..ButtonConfig::default()
            },
            config_btn: ButtonConfig {
                x: 58,
                y: 4,
                up: "/title/config_up.svg".into(),
                over: "/title/config_over.svg".into(),
                down: "/title/config_down.svg".into(),
                ..ButtonConfig::default()
            },
            quit_btn: ButtonConfig {
                x: 28,
                y: 4,
                up: "/title/quit_up.svg".into(),
                over: "/title/quit_over.svg".into(),
                down: "/title/quit_down.svg".into(),
                ..ButtonConfig::default()
            },
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase", default)]
pub struct TabsConfig {
    pub tabs_x: i32,
    pub tabs_y: i32,
    pub selected_color: RgbColor,
    pub unselected_color: RgbColor,
    pub separator_image: Option<String>,
    pub selected_left: String,
    pub selected_middle: String,
    pub selected_right: String,
    pub unselected_left: String,
    pub unselected_middle: String,
    pub unselected_right: String,
    pub prevent_closing_image: String,
    pub prevent_closing_image_x: i32,
    pub prevent_closing_image_y: i32,
    pub selected_text_bold: bool,
    pub compact: bool,
    #[serde(default = "default_true")]
    pub lock_enabled: bool,
    pub bg_center: String,
    pub bg_left: String,
    pub bg_right: String,
    pub bg_translucent: bool,
    #[serde(default = "default_true")]
    pub tabs_enabled: bool,
    pub lock_btn: ButtonConfig,
    pub plus_btn: ButtonConfig,
    pub minus_btn: ButtonConfig,
    pub close_btn: ButtonConfig,
}

impl Default for TabsConfig {
    fn default() -> Self {
        TabsConfig {
            tabs_x: 36,
            tabs_y: 0,
            selected_color: RgbColor {
                r: 102,
                g: 194,
                b: 242,
            },
            unselected_color: RgbColor {
                r: 150,
                g: 150,
                b: 150,
            },
            separator_image: Some("/tabs/tab_separator.svg".into()),
            selected_left: "/tabs/tab_selected_left.svg".into(),
            selected_middle: "/tabs/tab_selected_middle.svg".into(),
            selected_right: "/tabs/tab_selected_right.svg".into(),
            unselected_left: "/tabs/tab_unselected_left.svg".into(),
            unselected_middle: "/tabs/tab_unselected_middle.svg".into(),
            unselected_right: "/tabs/tab_unselected_right.svg".into(),
            prevent_closing_image: "/tabs/lock.svg".into(),
            prevent_closing_image_x: 0,
            prevent_closing_image_y: 8,
            selected_text_bold: true,
            compact: false,
            lock_enabled: true,
            bg_center: "/tabs/background_center.svg".into(),
            bg_left: "/tabs/background_left.svg".into(),
            bg_right: "/tabs/background_right.svg".into(),
            bg_translucent: false,
            tabs_enabled: true,
            lock_btn: ButtonConfig {
                x: 0,
                y: 8,
                up: "/tabs/lock.svg".into(),
                over: "/tabs/lock.svg".into(),
                down: "/tabs/lock.svg".into(),
                ..ButtonConfig::default()
            },
            plus_btn: ButtonConfig {
                x: 2,
                y: 6,
                up: "/tabs/plus_up.svg".into(),
                over: "/tabs/plus_over.svg".into(),
                down: "/tabs/plus_down.svg".into(),
                ..ButtonConfig::default()
            },
            minus_btn: ButtonConfig {
                x: 22,
                y: 6,
                up: "/tabs/minus_up.svg".into(),
                over: "/tabs/minus_over.svg".into(),
                down: "/tabs/minus_down.svg".into(),
                ..ButtonConfig::default()
            },
            close_btn: ButtonConfig {
                x: 5,
                y: 5,
                up: "/tabs/close_up.svg".into(),
                over: "/tabs/close_over.svg".into(),
                down: "/tabs/close_down.svg".into(),
                ..ButtonConfig::default()
            },
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase", default)]
pub struct GlobalColors {
    pub bg: String,
    pub selected: String,
    pub text: String,
    pub dim: String,
    pub konsole_background: String,
}

#[derive(Serialize, Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase", default)]
pub struct ButtonStateColors {
    pub up_bg: String,
    pub up_icon: String,
    pub over_bg: String,
    pub over_icon: String,
    pub down_bg: String,
    pub down_icon: String,
}

#[derive(Serialize, Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase", default)]
pub struct ButtonColors {
    pub focus: ButtonStateColors,
    pub config: ButtonStateColors,
    pub quit: ButtonStateColors,
    pub plus: ButtonStateColors,
    pub minus: ButtonStateColors,
    pub close: ButtonStateColors,
}

#[derive(Serialize, Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase", default)]
pub struct IconSet {
    pub settings: String,
    pub maximize: String,
    pub close: String,
    pub plus: String,
    pub minus: String,
    pub lock: String,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase", default)]
pub struct GlobalConfig {
    pub icon_library: String,
    pub icon_set: IconSet,
    pub colors: GlobalColors,
    pub button_colors: ButtonColors,
    pub border_radius: i32,
    pub opacity: i32,
    pub translucency: bool,
}

impl Default for GlobalConfig {
    fn default() -> Self {
        GlobalConfig {
            icon_library: "lucide".into(),
            icon_set: IconSet {
                settings: "LuSettings".into(),
                maximize: "LuMaximize2".into(),
                close: "LuX".into(),
                plus: "LuPlus".into(),
                minus: "LuMinus".into(),
                lock: "LuLock".into(),
            },
            colors: GlobalColors {
                bg: "#1e2233".into(),
                selected: "#3b4252".into(),
                text: "#66c2f2".into(),
                dim: "#232834".into(),
                konsole_background: "#2a2e3f".into(),
            },
            button_colors: ButtonColors::default(),
            border_radius: 0,
            opacity: 100,
            translucency: false,
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase", default)]
pub struct SkinConfig {
    pub meta: SkinMeta,
    pub title: TitleConfig,
    pub tabs: TabsConfig,
    pub global: GlobalConfig,
}

/// A parsed skin metadata file: the configuration plus per-role icon markup
/// (raw SVG fragments) when the file embeds them.
pub struct ParsedSkin {
    pub meta: SkinMeta,
    pub config: SkinConfig,
    pub icon_markup: std::collections::HashMap<String, String>,
}

/// Parses a skin JSON file. Accepts both the raw `SkinConfig` shape and the
/// `metadata.json` wrapper (`skin` + `config.data` + `config.icons`).
pub fn parse_skin_json(text: &str) -> Result<ParsedSkin, String> {
    let value: serde_json::Value =
        serde_json::from_str(text).map_err(|e| format!("Invalid JSON: {e}"))?;

    let empty = serde_json::Value::Null;
    let (meta_value, config_value, icons_value) =
        if value.get("config").and_then(|c| c.get("data")).is_some() {
            (
                value
                    .get("skin")
                    .cloned()
                    .unwrap_or(serde_json::Value::Null),
                value["config"]["data"].clone(),
                value
                    .get("config")
                    .and_then(|c| c.get("icons"))
                    .cloned()
                    .unwrap_or(serde_json::Value::Null),
            )
        } else {
            (
                value
                    .get("meta")
                    .cloned()
                    .unwrap_or(serde_json::Value::Null),
                value.clone(),
                empty,
            )
        };

    let config: SkinConfig = serde_json::from_value(config_value)
        .map_err(|e| format!("Invalid skin configuration: {e}"))?;
    let meta: SkinMeta =
        serde_json::from_value(meta_value).map_err(|e| format!("Invalid skin metadata: {e}"))?;

    // Fill empty metadata fields from the defaults.
    let defaults = SkinMeta::default();
    let meta = SkinMeta {
        email: if meta.email.is_empty() {
            defaults.email
        } else {
            meta.email
        },
        web: meta.web.or(defaults.web),
        icon: if meta.icon.is_empty() {
            defaults.icon
        } else {
            meta.icon
        },
        ..meta
    };

    let icon_markup: std::collections::HashMap<String, String> =
        serde_json::from_value(icons_value).unwrap_or_default();

    Ok(ParsedSkin {
        meta,
        config,
        icon_markup,
    })
}
