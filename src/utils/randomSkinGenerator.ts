/**
 * @file src/utils/randomSkinGenerator.ts
 * @description Generates cohesive random themes: harmony-based HSL palettes
 * with enforced WCAG contrast, derived button states, randomized icon sets and
 * a palette-derived evocative skin name.
 *
 * @copyright Copyright (C) 2026 sanguine6660
 * @since 1.1.0
 * @license GPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { DEFAULT_ICON_SETS, SKIN_ATTRIBUTION } from '../constants'
import type { IconLibrary, SkinConfig } from '../types'
import { deriveKonsoleBackground, hslToHsv, hsvToHex } from './colors'
import { deriveColorscheme } from './konsoleScheme'

type Rng = () => number

// ---- Roll history ---------------------------------------------------------------

export interface RandomSkinHistoryEntry {
    id: string
    /** Title-bar name of the rolled skin */
    name: string
    appliedAt: number
    config: SkinConfig
}

export const RANDOM_HISTORY_LIMIT = 10

let historyCounter = 0

/** Prepends a roll to the history (newest first), capped at the limit. */
export const pushRandomSkinEntry = (
    history: RandomSkinHistoryEntry[],
    entry: Omit<RandomSkinHistoryEntry, 'id'>,
    limit: number = RANDOM_HISTORY_LIMIT
): RandomSkinHistoryEntry[] => {
    historyCounter += 1
    const withId: RandomSkinHistoryEntry = {
        ...entry,
        id: `${entry.appliedAt.toString(36)}-${historyCounter}`,
    }
    return [withId, ...history].slice(0, limit)
}

const range = (rng: Rng, min: number, max: number): number => min + rng() * (max - min)
const pick = <T>(rng: Rng, items: readonly T[]): T =>
    items[Math.min(Math.floor(rng() * items.length), items.length - 1)]

const hslToHex = (h: number, s: number, l: number): string => {
    const hsv = hslToHsv({ h: ((h % 360) + 360) % 360, s, l })
    return hsvToHex(hsv.h, hsv.s, hsv.v)
}

// ---- Contrast ----------------------------------------------------------------

const relativeLuminance = (hex: string): number => {
    const clean = hex.replace('#', '')
    const channel = (i: number) => {
        const raw = parseInt(clean.slice(i * 2, i * 2 + 2), 16) / 255
        return raw <= 0.03928 ? raw / 12.92 : ((raw + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2)
}

/** WCAG contrast ratio between two hex colors (1 … 21). */
export const contrastRatio = (a: string, b: string): number => {
    const la = relativeLuminance(a)
    const lb = relativeLuminance(b)
    const [lighter, darker] = la >= lb ? [la, lb] : [lb, la]
    return (lighter + 0.05) / (darker + 0.05)
}

interface AccentHsl {
    h: number
    s: number
    l: number
}

/** Nudges accent lightness until the text/background ratio passes `target`. */
const ensureContrast = (
    accent: AccentHsl,
    backgroundHex: string,
    isLight: boolean,
    target = 4.5
): AccentHsl => {
    let tuned = { ...accent }
    for (
        let i = 0;
        i < 12 && contrastRatio(hslToHex(tuned.h, tuned.s, tuned.l), backgroundHex) < target;
        i++
    ) {
        tuned = { ...tuned, l: Math.min(96, Math.max(4, tuned.l + (isLight ? -2.5 : 2.5))) }
    }
    return tuned
}

// ---- Naming -------------------------------------------------------------------

const HUE_COLOR_NAMES: ReadonlyArray<{ upTo: number; names: readonly string[] }> = [
    { upTo: 15, names: ['Crimson', 'Scarlet', 'Ruby', 'Ember'] },
    { upTo: 45, names: ['Amber', 'Citrus', 'Copper', 'Sunset'] },
    { upTo: 70, names: ['Golden', 'Honey', 'Saffron'] },
    { upTo: 150, names: ['Emerald', 'Fern', 'Jade', 'Mint', 'Verdant'] },
    { upTo: 190, names: ['Turquoise', 'Lagoon', 'Tropic', 'Aqua'] },
    { upTo: 230, names: ['Azure', 'Cobalt', 'Ocean', 'Cyan'] },
    { upTo: 270, names: ['Sapphire', 'Indigo', 'Navy', 'Denim'] },
    { upTo: 300, names: ['Amethyst', 'Violet', 'Plum', 'Iris'] },
    { upTo: 330, names: ['Orchid', 'Magenta', 'Fuchsia', 'Lotus'] },
    { upTo: 360, names: ['Rose', 'Flamingo', 'Blush', 'Peony'] },
]

const DARK_MOODS = ['Midnight', 'Nocturne', 'Deep', 'Shadow', 'Drift', 'Nebula', 'Eclipse']
const LIGHT_MOODS = ['Daybreak', 'Dawn', 'Frost', 'Blossom', 'Paper', 'Morning', 'Veil']

/**
 * Builds an evocative name that reflects the generated accent hue and the
 * theme's overall mood, e.g. "Neon Fuchsia", "Amber Nocturne",
 * "Azure Daybreak Terminal".
 */
export const generateSkinName = (
    accentHue: number,
    accentSaturation: number,
    isLight: boolean,
    rng: Rng = Math.random
): string => {
    const hue = ((accentHue % 360) + 360) % 360
    const bucket = HUE_COLOR_NAMES.find((entry) => hue <= entry.upTo) ?? HUE_COLOR_NAMES[0]
    const colorWord = pick(rng, bucket.names)
    const moodWord = pick(rng, isLight ? LIGHT_MOODS : DARK_MOODS)

    const patterns: Array<() => string> = [
        () => `${colorWord} ${moodWord}`,
        () => `${moodWord} ${colorWord}`,
        () => (accentSaturation >= 72 ? `Neon ${colorWord}` : `${moodWord} ${colorWord}`),
    ]
    let name = pick(rng, patterns)()

    if (rng() < 0.35) {
        name += ' ' + pick(rng, ['Terminal', 'Shell', 'Console', 'Prompt'])
    }
    return name
}

// ---- Palette ------------------------------------------------------------------

const HARMONIES = [28, -28, 180, 118, -118, 152, -152] as const

interface RandomPalette {
    bg: string
    selected: string
    text: string
    dim: string
    isLight: boolean
    accentHue: number
    accentSaturation: number
    borderRadius: number
    translucency: boolean
    opacity: number
}

const generatePalette = (rng: Rng): RandomPalette => {
    const isLight = rng() < 0.4
    const tintHue = rng() * 360
    // Accent sits at a classical harmony offset from the background tint so
    // foreground and chrome never clash.
    const accentHue = (tintHue + pick(rng, HARMONIES) + range(rng, -10, 10)) % 360

    const bgLightness = isLight ? range(rng, 93, 97) : range(rng, 4, 9)
    const bgSaturation = isLight ? range(rng, 5, 12) : range(rng, 8, 18)

    const dimLightness = isLight ? bgLightness - range(rng, 3, 5) : bgLightness + range(rng, 3, 4.5)
    const selectedLightness = isLight
        ? bgLightness - range(rng, 6, 10)
        : bgLightness + range(rng, 7, 11)

    const accent: AccentHsl = {
        h: accentHue,
        s: range(rng, 58, 85),
        l: isLight ? range(rng, 32, 44) : range(rng, 60, 74),
    }

    const bg = hslToHex(tintHue, bgSaturation, bgLightness)
    const tunedAccent = ensureContrast(accent, bg, isLight)

    return {
        bg,
        selected: hslToHex(tintHue, Math.min(bgSaturation + 8, 26), selectedLightness),
        text: hslToHex(tunedAccent.h, tunedAccent.s, tunedAccent.l),
        dim: hslToHex(tintHue, Math.min(bgSaturation + 3, 24), dimLightness),
        isLight,
        accentHue,
        accentSaturation: tunedAccent.s,
        borderRadius: pick(rng, [0, 2, 3, 4, 5, 6, 8]),
        translucency: rng() < 0.15,
        opacity: Math.round(range(rng, 90, 100)),
    }
}

/** A warm red that still harmonizes with the accent hue (for destructive buttons). */
const dangerColor = (accentHue: number, isLight: boolean): string => {
    const normalized = ((accentHue % 360) + 360) % 360
    const inWarmBand = normalized <= 25 || normalized >= 340
    const hue = inWarmBand ? normalized : 350 + (((normalized * 7) % 20) - 10)
    return hslToHex(hue, 62, isLight ? 46 : 66)
}

// ---- Assembly -----------------------------------------------------------------

const hexToRgbTuple = (hex: string): { r: number; g: number; b: number } => {
    const clean = hex.replace('#', '')
    return {
        r: parseInt(clean.slice(0, 2), 16) || 0,
        g: parseInt(clean.slice(2, 4), 16) || 0,
        b: parseInt(clean.slice(4, 6), 16) || 0,
    }
}

const LIBRARY_IDS = Object.keys(DEFAULT_ICON_SETS) as IconLibrary[]

const standardButtonState = (dim: string, selected: string, text: string, bg: string) => ({
    upBg: dim,
    upIcon: text,
    overBg: selected,
    overIcon: text,
    downBg: text,
    downIcon: bg,
})

/**
 * Generates a complete random skin on top of `base`: structural settings
 * (geometry, image paths, enabled flags, metadata) are preserved, while the
 * palette, shape feel, icon library and title text are re-rolled coherently.
 */
export const generateRandomSkin = (base: SkinConfig, rng: Rng = Math.random): SkinConfig => {
    const palette = generatePalette(rng)
    const iconLibrary = pick(rng, LIBRARY_IDS)
    const name = generateSkinName(palette.accentHue, palette.accentSaturation, palette.isLight, rng)

    const state = standardButtonState(palette.dim, palette.selected, palette.text, palette.bg)
    const quitState = {
        ...state,
        downBg: dangerColor(palette.accentHue, palette.isLight),
        downIcon: '#ffffff',
    }

    const assembled: SkinConfig = {
        ...base,
        meta: {
            ...base.meta,
            skinName: name,
            author: SKIN_ATTRIBUTION.author,
            email: SKIN_ATTRIBUTION.email,
            web: SKIN_ATTRIBUTION.web,
        },
        global: {
            ...base.global,
            colors: {
                bg: palette.bg,
                selected: palette.selected,
                text: palette.text,
                dim: palette.dim,
                konsoleBackground: deriveKonsoleBackground(palette.bg),
            },
            iconLibrary,
            iconSet: DEFAULT_ICON_SETS[iconLibrary],
            buttonColors: {
                focus: { ...state },
                config: { ...state },
                plus: { ...state },
                minus: { ...state },
                close: { ...state },
                quit: quitState,
            },
            borderRadius: palette.borderRadius,
            translucency: palette.translucency,
            opacity: palette.opacity,
        },
        title: {
            ...base.title,
            textColor: hexToRgbTuple(palette.text),
            textContent: name,
        },
        tabs: {
            ...base.tabs,
            selectedColor: hexToRgbTuple(palette.text),
        },
    }

    // Every roll also comes with a matching full ANSI terminal palette.
    const skin: SkinConfig = {
        ...assembled,
        terminal: deriveColorscheme(assembled),
    }
    return skin
}
