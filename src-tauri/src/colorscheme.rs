//! Color math and Konsole colorscheme support - a 1:1 port of the TypeScript
//! `konsoleScheme.ts` module. Byte-identical output is enforced by the golden
//! parity suite.

use crate::config::{RgbColor, SkinConfig, TerminalColorscheme};

pub fn rgb_to_hex(c: &RgbColor) -> String {
    format!("#{:02x}{:02x}{:02x}", c.r, c.g, c.b)
}

pub fn hex_to_rgb(hex: &str) -> RgbColor {
    let clean = hex.trim_start_matches('#');
    RgbColor {
        r: u8::from_str_radix(clean.get(0..2).unwrap_or("0"), 16).unwrap_or(0),
        g: u8::from_str_radix(clean.get(2..4).unwrap_or("0"), 16).unwrap_or(0),
        b: u8::from_str_radix(clean.get(4..6).unwrap_or("0"), 16).unwrap_or(0),
    }
}

fn clamp_channel(v: f64) -> u8 {
    v.round().clamp(0.0, 255.0) as u8
}

fn mix_rgb(a: &RgbColor, b: &RgbColor, amount: f64) -> RgbColor {
    RgbColor {
        r: clamp_channel(a.r as f64 + (b.r as f64 - a.r as f64) * amount),
        g: clamp_channel(a.g as f64 + (b.g as f64 - a.g as f64) * amount),
        b: clamp_channel(a.b as f64 + (b.b as f64 - a.b as f64) * amount),
    }
}

#[derive(Clone, Copy)]
pub struct Hsl {
    h: f64,
    s: f64,
    l: f64,
}

pub fn rgb_to_hsl(c: &RgbColor) -> Hsl {
    let rn = f64::from(c.r) / 255.0;
    let gn = f64::from(c.g) / 255.0;
    let bn = f64::from(c.b) / 255.0;
    let max = rn.max(gn).max(bn);
    let min = rn.min(gn).min(bn);
    let l = (max + min) / 2.0;
    if max == min {
        return Hsl {
            h: 0.0,
            s: 0.0,
            l: l * 100.0,
        };
    }
    let d = max - min;
    let s = if l > 0.5 {
        d / (2.0 - max - min)
    } else {
        d / (max + min)
    };
    let h = if max == rn {
        ((gn - bn) / d + if gn < bn { 6.0 } else { 0.0 }) * 60.0
    } else if max == gn {
        ((bn - rn) / d + 2.0) * 60.0
    } else {
        ((rn - gn) / d + 4.0) * 60.0
    };
    Hsl {
        h,
        s: s * 100.0,
        l: l * 100.0,
    }
}

fn hsl_to_rgb(hsl: &Hsl) -> RgbColor {
    let s = hsl.s / 100.0;
    let l = hsl.l / 100.0;
    let k = |n: f64| (n + hsl.h / 30.0) % 12.0;
    let a = s * l.min(1.0 - l);
    let f = |n: f64| l - a * (-1.0f64).max((k(n) - 3.0).min((9.0 - k(n)).min(1.0)));
    RgbColor {
        r: clamp_channel(f(0.0) * 255.0),
        g: clamp_channel(f(8.0) * 255.0),
        b: clamp_channel(f(4.0) * 255.0),
    }
}

fn adjust_lightness(color: &RgbColor, delta_percent: f64) -> RgbColor {
    let mut hsl = rgb_to_hsl(color);
    hsl.l = (hsl.l + delta_percent).clamp(3.0, 97.0);
    hsl_to_rgb(&hsl)
}

fn relative_luminance(c: &RgbColor) -> f64 {
    let lin = |raw: u8| {
        let v = f64::from(raw) / 255.0;
        if v <= 0.03928 {
            v / 12.92
        } else {
            ((v + 0.055) / 1.055).powf(2.4)
        }
    };
    0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b)
}

pub fn contrast_ratio(a: &RgbColor, b: &RgbColor) -> f64 {
    let la = relative_luminance(a);
    let lb = relative_luminance(b);
    let (lighter, darker) = if la >= lb { (la, lb) } else { (lb, la) };
    (lighter + 0.05) / (darker + 0.05)
}

/// Guarantees perceptual separation from the background: minimum luminance
/// delta plus hard lightness bands and a saturation floor. Mirrors the
/// TypeScript `ensureVibrant`.
fn ensure_vibrant(
    color: RgbColor,
    bg: &RgbColor,
    is_light_background: bool,
    min_lum_delta: f64,
) -> RgbColor {
    let bg_lum = relative_luminance(bg);
    let mut tuned = color;
    for _guard in 0..16 {
        let delta = relative_luminance(&tuned) - bg_lum;
        let satisfied = if is_light_background {
            -delta >= min_lum_delta
        } else {
            delta >= min_lum_delta
        };
        if satisfied {
            break;
        }
        tuned = adjust_lightness(&tuned, if is_light_background { -3.0 } else { 3.0 });
    }
    let mut hsl = rgb_to_hsl(&tuned);
    hsl.l = if is_light_background {
        hsl.l.clamp(30.0, 46.0)
    } else {
        hsl.l.clamp(55.0, 76.0)
    };
    hsl.s = hsl.s.max(52.0);
    hsl_to_rgb(&hsl)
}

fn ensure_readable(
    color: RgbColor,
    bg: &RgbColor,
    is_light_background: bool,
    target: f64,
) -> RgbColor {
    let mut tuned = color;
    let mut iterations = 0;
    while contrast_ratio(&tuned, bg) < target && iterations < 14 {
        tuned = adjust_lightness(&tuned, if is_light_background { -3.0 } else { 3.0 });
        iterations += 1;
    }
    tuned
}

/// Canonical ANSI base hues: red, green, yellow, blue, magenta, cyan.
const ANSI_BASE_HUES: [f64; 6] = [0.0, 120.0, 60.0, 240.0, 300.0, 180.0];

fn circular_distance(a: f64, b: f64) -> f64 {
    let d = ((a - b) % 360.0 + 360.0) % 360.0;
    if d > 180.0 {
        360.0 - d
    } else {
        d
    }
}

pub fn derive_colorscheme(config: &SkinConfig) -> TerminalColorscheme {
    let palette = &config.global.colors;
    let is_light = relative_luminance(&hex_to_rgb(&palette.bg)) > 0.4;

    let background = hex_to_rgb(if palette.konsole_background.is_empty() {
        &palette.bg
    } else {
        &palette.konsole_background
    });
    let accent = hex_to_rgb(&palette.text);

    // Foreground: readable near-neutral with a whisper of the accent hue.
    let accent_hsl = rgb_to_hsl(&accent);
    let fg_hsl = Hsl {
        h: accent_hsl.h,
        s: (accent_hsl.s * 0.35).min(22.0),
        l: if is_light { 18.0 } else { 88.0 },
    };
    let foreground = ensure_readable(hsl_to_rgb(&fg_hsl), &background, is_light, 7.0);

    // Hue rotation so the accent lands on its natural ANSI slot.
    let nearest = ANSI_BASE_HUES
        .iter()
        .copied()
        .reduce(|best, base| {
            if circular_distance(accent_hsl.h, base) < circular_distance(accent_hsl.h, best) {
                base
            } else {
                best
            }
        })
        .unwrap_or(0.0);
    let mut rotation = ((accent_hsl.h - nearest) % 360.0 + 360.0) % 360.0;
    if rotation > 180.0 {
        rotation -= 360.0;
    }

    let normal_l = if is_light { 38.0 } else { 66.0 };
    let intense_l = if is_light { 28.0 } else { 74.0 };

    let mut ansi = Vec::with_capacity(8);
    let mut ansi_intense = Vec::with_capacity(8);
    let mut ansi_faint = Vec::with_capacity(8);

    for slot in 0..8 {
        match slot {
            0 => {
                let black = adjust_lightness(&background, if is_light { -82.0 } else { -6.0 });
                ansi.push(black.clone());
                ansi_intense.push(mix_rgb(&black, &foreground, 0.45));
                ansi_faint.push(mix_rgb(&black, &background, 0.25));
            }
            7 => {
                let white = adjust_lightness(&background, if is_light { 4.0 } else { 78.0 });
                ansi.push(white.clone());
                ansi_intense.push(if is_light {
                    white.clone()
                } else {
                    adjust_lightness(&white, 8.0)
                });
                ansi_faint.push(mix_rgb(&white, &background, 0.35));
            }
            other => {
                let hue = (ANSI_BASE_HUES[other - 1] + rotation + 360.0) % 360.0;
                let vivid = ensure_vibrant(
                    hsl_to_rgb(&Hsl {
                        h: hue,
                        s: 64.0,
                        l: normal_l,
                    }),
                    &background,
                    is_light,
                    0.15,
                );
                let normal = ensure_readable(vivid, &background, is_light, 3.0);
                ansi.push(normal.clone());
                ansi_intense.push(hsl_to_rgb(&Hsl {
                    h: hue,
                    s: 68.0f64.min(70.0),
                    l: intense_l,
                }));
                ansi_faint.push(mix_rgb(&normal, &background, 0.38));
            }
        }
    }

    TerminalColorscheme {
        enabled: Some(true),
        description: Some(format!("{} Terminal", config.meta.skin_name)),
        opacity: config.global.opacity,
        background: background.clone(),
        background_intense: adjust_lightness(&background, if is_light { -5.0 } else { 5.0 }),
        background_faint: background.clone(),
        foreground: foreground.clone(),
        foreground_intense: ensure_readable(
            accent.clone(),
            &background,
            is_light,
            if contrast_ratio(&accent, &background) >= 7.0 {
                7.0
            } else {
                4.5
            },
        ),
        foreground_faint: mix_rgb(&foreground, &background, 0.42),
        ansi,
        ansi_intense,
        ansi_faint,
    }
}

fn emit_slot(section: &str, normal: &RgbColor, intense: &RgbColor, faint: &RgbColor) -> String {
    format!(
        "[{section}]\nColor={},{},{}\n\n[{section}Intense]\nColor={},{},{}\n\n[{section}Faint]\nColor={},{},{}\n\n",
        normal.r, normal.g, normal.b, intense.r, intense.g, intense.b, faint.r, faint.g, faint.b
    )
}

/// Renders the scheme as Konsole INI. Must stay byte-identical to the
/// TypeScript `generateColorschemeText`.
pub fn generate_colorscheme_text(scheme: &TerminalColorscheme) -> String {
    let mut out = String::from("[General]\n");
    if let Some(description) = &scheme.description {
        out.push_str(&format!("Description={description}\n"));
    }
    out.push_str(&format!(
        "Opacity={:.2}\n\n",
        f64::from(scheme.opacity) / 100.0
    ));

    out.push_str(&emit_slot(
        "Background",
        &scheme.background,
        &scheme.background_intense,
        &scheme.background_faint,
    ));
    out.push_str(&emit_slot(
        "Foreground",
        &scheme.foreground,
        &scheme.foreground_intense,
        &scheme.foreground_faint,
    ));
    for i in 0..8 {
        out.push_str(&emit_slot(
            &format!("Color{i}"),
            &scheme.ansi[i],
            &scheme.ansi_intense[i],
            &scheme.ansi_faint[i],
        ));
    }
    // Match the TypeScript join('\n') semantics: exactly one trailing newline.
    format!("{}\n", out.trim_end_matches('\n'))
}
