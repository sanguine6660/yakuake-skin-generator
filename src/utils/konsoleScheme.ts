/**
 * @file src/utils/konsoleScheme.ts
 * @description Konsole `.colorscheme` companion: derives a full 20-slot
 * terminal palette from the skin's colors, parses existing schemes and emits
 * the INI format Konsole consumes.
 *
 * Format verified against Konsole's ColorScheme.cpp: `Color=` accepts
 * "r,g,b" triplets or "#rrggbb"; slots exist in Normal, Intense and Faint
 * variants; `[General]` carries Description and Opacity (0.0–1.0).
 *
 * @copyright Copyright (C) 2026 sanguine6660
 * @since 1.1.0
 * @license GPL-3.0-or-later
 */

import type { RgbColor, SkinConfig, TerminalColorscheme } from '../types'

// ---- small color helpers -------------------------------------------------------

export const rgbToHex = ({ r, g, b }: RgbColor): string =>
    `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`

export const hexToRgb = (hex: string): RgbColor => {
    const clean = hex.replace('#', '')
    return {
        r: parseInt(clean.slice(0, 2), 16) || 0,
        g: parseInt(clean.slice(2, 4), 16) || 0,
        b: parseInt(clean.slice(4, 6), 16) || 0,
    }
}

const mixRgb = (a: RgbColor, b: RgbColor, amount: number): RgbColor => ({
    r: Math.round(a.r + (b.r - a.r) * amount),
    g: Math.round(a.g + (b.g - a.g) * amount),
    b: Math.round(a.b + (b.b - a.b) * amount),
})

const clampChannel = (v: number): number => Math.min(255, Math.max(0, Math.round(v)))

/** Relative luminance (WCAG). */
export const relativeLuminance = ({ r, g, b }: RgbColor): number => {
    const lin = (raw: number) => {
        const c = raw / 255
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

export const contrastRatio = (a: RgbColor, b: RgbColor): number => {
    const la = relativeLuminance(a)
    const lb = relativeLuminance(b)
    const [lighter, darker] = la >= lb ? [la, lb] : [lb, la]
    return (lighter + 0.05) / (darker + 0.05)
}

interface Hsl {
    h: number
    s: number // 0..100
    l: number // 0..100
}

export const rgbToHsl = ({ r, g, b }: RgbColor): Hsl => {
    const rn = r / 255
    const gn = g / 255
    const bn = b / 255
    const max = Math.max(rn, gn, bn)
    const min = Math.min(rn, gn, bn)
    const l = (max + min) / 2
    if (max === min) return { h: 0, s: 0, l: l * 100 }
    const d = max - min
    const sat = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    let h: number
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60
    else if (max === gn) h = ((bn - rn) / d + 2) * 60
    else h = ((rn - gn) / d + 4) * 60
    return { h, s: sat * 100, l: l * 100 }
}

const hslToRgb = ({ h, s, l }: Hsl): RgbColor => {
    const sn = s / 100
    const ln = l / 100
    const k = (n: number) => (n + h / 30) % 12
    const a = sn * Math.min(ln, 1 - ln)
    const f = (n: number) => ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return {
        r: clampChannel(f(0) * 255),
        g: clampChannel(f(8) * 255),
        b: clampChannel(f(4) * 255),
    }
}

const adjustLightness = (color: RgbColor, deltaPercent: number): RgbColor => {
    const hsl = rgbToHsl(color)
    return hslToRgb({ ...hsl, l: Math.min(97, Math.max(3, hsl.l + deltaPercent)) })
}

/**
 * Guarantees perceptual separation from the background: a minimum luminance
 * delta plus hard lightness bands (vivid-but-readable on dark, deep-but-not-
 * washed-out on light) and a minimum saturation floor.
 */
const ensureVibrant = (
    color: RgbColor,
    bg: RgbColor,
    isLightBackground: boolean,
    minLumDelta = 0.15
): RgbColor => {
    const bgLum = relativeLuminance(bg)
    let tuned = color
    for (let guard = 0; guard < 16; guard++) {
        const delta = relativeLuminance(tuned) - bgLum
        if (isLightBackground ? -delta >= minLumDelta : delta >= minLumDelta) break
        tuned = adjustLightness(tuned, isLightBackground ? -3 : 3)
    }
    const hsl = rgbToHsl(tuned)
    const l = isLightBackground
        ? Math.min(46, Math.max(30, hsl.l))
        : Math.min(76, Math.max(55, hsl.l))
    return hslToRgb({ ...hsl, s: Math.max(hsl.s, 52), l })
}

/** Nudges lightness until the color reaches `target` contrast against `bg`. */
const ensureReadable = (
    color: RgbColor,
    bg: RgbColor,
    isLightBackground: boolean,
    target: number
): RgbColor => {
    let tuned = color
    for (let i = 0; i < 14 && contrastRatio(tuned, bg) < target; i++) {
        tuned = adjustLightness(tuned, isLightBackground ? -3 : 3)
    }
    return tuned
}

// ---- derivation -----------------------------------------------------------------

/** Canonical ANSI base hues: red, green, yellow, blue, magenta, cyan. */
const ANSI_BASE_HUES = [0, 120, 60, 240, 300, 180]

const circularDistance = (a: number, b: number): number => {
    const d = Math.abs((((a - b) % 360) + 360) % 360)
    return d > 180 ? 360 - d : d
}

/**
 * Derives the full scheme from a skin config's palette. The six chromatic ANSI
 * hues are rotated as a wheel so the accent hue lands exactly on its natural
 * slot — themes keep their family identity across all 16 colors.
 */
export const deriveColorscheme = (config: SkinConfig): TerminalColorscheme => {
    const { bg, text, konsoleBackground } = config.global.colors
    const isLight = relativeLuminance(hexToRgb(bg)) > 0.4

    const background = konsoleBackground ? hexToRgb(konsoleBackground) : hexToRgb(bg)
    const accent = hexToRgb(text)

    // Foreground: readable near-neutral that keeps a whisper of the accent hue.
    const accentHsl = rgbToHsl(accent)
    const fgHsl: Hsl = {
        h: accentHsl.h,
        s: Math.min(accentHsl.s * 0.35, 22),
        l: isLight ? 18 : 88,
    }
    const foreground = ensureReadable(hslToRgb(fgHsl), background, isLight, 7)

    // Hue rotation: place the accent on its closest natural ANSI slot and turn
    // the whole wheel by the same amount.
    const nearest = ANSI_BASE_HUES.reduce((best, base) =>
        circularDistance(accentHsl.h, base) < circularDistance(accentHsl.h, best) ? base : best
    )
    let rotation = (((accentHsl.h - nearest) % 360) + 360) % 360
    if (rotation > 180) rotation -= 360

    const normalL = isLight ? 38 : 66
    const intenseL = isLight ? 28 : 74

    const ansi: RgbColor[] = []
    const ansiIntense: RgbColor[] = []
    const ansiFaint: RgbColor[] = []

    for (let slot = 0; slot < 8; slot++) {
        if (slot === 0) {
            // Black: darker than the terminal background.
            const black = adjustLightness(background, isLight ? -82 : -6)
            ansi.push(black)
            ansiIntense.push(mixRgb(black, foreground, 0.45))
            ansiFaint.push(mixRgb(black, background, 0.25))
            continue
        }
        if (slot === 7) {
            // White: near-opposite extreme of Color0.
            const white = adjustLightness(background, isLight ? 4 : 78)
            ansi.push(white)
            ansiIntense.push(isLight ? white : adjustLightness(white, 8))
            ansiFaint.push(mixRgb(white, background, 0.35))
            continue
        }
        const hue = (ANSI_BASE_HUES[slot - 1] + rotation + 360) % 360
        const vivid = ensureVibrant(hslToRgb({ h: hue, s: 64, l: normalL }), background, isLight)
        const normal = ensureReadable(vivid, background, isLight, 3)
        ansi.push(normal)
        ansiIntense.push(hslToRgb({ h: hue, s: Math.min(70, 68), l: intenseL }))
        ansiFaint.push(mixRgb(normal, background, 0.38))
    }

    const backgroundIntense = adjustLightness(background, isLight ? -5 : 5)
    const backgroundFaint = background

    const foregroundIntense = ensureReadable(
        accent,
        background,
        isLight,
        contrastRatio(accent, background) >= 7 ? 7 : 4.5
    )
    const foregroundFaint = mixRgb(foreground, background, 0.42)

    return {
        enabled: true,
        description: `${config.meta.skinName} Terminal`,
        opacity: config.global.opacity,
        background,
        backgroundIntense,
        backgroundFaint,
        foreground,
        foregroundIntense,
        foregroundFaint,
        ansi,
        ansiIntense,
        ansiFaint,
    }
}

// ---- parsing --------------------------------------------------------------------

const parseColorValue = (raw: string): RgbColor | null => {
    const value = raw.trim()
    const triplet = value.match(/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/)
    if (triplet) {
        return {
            r: Math.min(255, Number(triplet[1])),
            g: Math.min(255, Number(triplet[2])),
            b: Math.min(255, Number(triplet[3])),
        }
    }
    if (/^#[0-9a-fA-F]{6}$/.test(value)) return hexToRgb(value)
    return null
}

/**
 * Parses a Konsole `.colorscheme` file (INI-style) into a partial scheme.
 * Unknown sections/keys are ignored; invalid colors fall back to defaults.
 */
export const parseColorschemeIni = (
    text: string,
    base: TerminalColorscheme
): TerminalColorscheme => {
    const result: TerminalColorscheme = structuredClone(base)
    let section = ''

    for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim()
        if (!line || line.startsWith('#')) continue

        const header = line.match(/^\[(.+)\]$/)
        if (header) {
            section = header[1].trim()
            continue
        }

        const eq = line.indexOf('=')
        if (eq <= 0) continue
        const key = line.slice(0, eq).trim()
        const value = line.slice(eq + 1).trim()

        if (section === 'General') {
            if (key === 'Description') result.description = value
            else if (key === 'Opacity') {
                const parsed = Number(value)
                if (Number.isFinite(parsed)) result.opacity = Math.round(parsed * 100)
            }
            continue
        }

        const color = parseColorValue(value)
        if (!color) continue

        if (section === 'Background') {
            if (key === 'Color') result.background = color
            else if (key === 'ColorIntense') result.backgroundIntense = color
            else if (key === 'ColorFaint') result.backgroundFaint = color
        } else if (section === 'Foreground') {
            if (key === 'Color') result.foreground = color
            else if (key === 'ColorIntense') result.foregroundIntense = color
            else if (key === 'ColorFaint') result.foregroundFaint = color
        } else {
            const slot = section.match(/^Color(\d)(Intense|Faint)?$/)
            if (slot) {
                const index = Number(slot[1])
                if (index >= 0 && index <= 7) {
                    const variant = slot[2]
                    if (!variant || key === 'Color') {
                        if (!variant) result.ansi[index] = color
                        else if (variant === 'Intense') result.ansiIntense[index] = color
                        else result.ansiFaint[index] = color
                    } else if (variant === 'Intense') {
                        result.ansiIntense[index] = color
                    } else {
                        result.ansiFaint[index] = color
                    }
                }
            }
        }
    }

    return result
}

// ---- emission ---------------------------------------------------------------------

const emitSlot = (
    section: string,
    normal: RgbColor,
    intense: RgbColor,
    faint: RgbColor
): string[] => [
    `[${section}]`,
    `Color=${normal.r},${normal.g},${normal.b}`,
    '',
    `[${section}Intense]`,
    `Color=${intense.r},${intense.g},${intense.b}`,
    '',
    `[${section}Faint]`,
    `Color=${faint.r},${faint.g},${faint.b}`,
    '',
]

/**
 * Renders the scheme as Konsole INI. Byte-stable output — the Rust port must
 * produce identical bytes (guarded by the golden parity suite).
 */
export const generateColorschemeText = (scheme: TerminalColorscheme): string => {
    const lines: string[] = ['[General]']
    if (scheme.description) lines.push(`Description=${scheme.description}`)
    lines.push(`Opacity=${(Math.round(scheme.opacity) / 100).toFixed(2)}`, '')

    lines.push(
        ...emitSlot(
            'Background',
            scheme.background,
            scheme.backgroundIntense,
            scheme.backgroundFaint
        )
    )
    lines.push(
        ...emitSlot(
            'Foreground',
            scheme.foreground,
            scheme.foregroundIntense,
            scheme.foregroundFaint
        )
    )

    for (let i = 0; i < 8; i++) {
        lines.push(
            ...emitSlot(`Color${i}`, scheme.ansi[i], scheme.ansiIntense[i], scheme.ansiFaint[i])
        )
    }

    return lines.join('\n')
}

/** Convenience: colorscheme text for a skin config (deriving when absent). */
export const colorschemeForConfig = (config: SkinConfig): string =>
    generateColorschemeText(config.terminal ?? deriveColorscheme(config))
