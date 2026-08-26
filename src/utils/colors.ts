/**
 * @file src/utils/colors.ts
 * @description Hex color manipulation helpers including brightness adjustment and derived terminal background generation
 * @copyright Copyright (C) 2026 sanguine6660
 * @since 1.0.0
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

export const adjustHexBrightness = (hex: string, amount: number): string => {
    const cleanHex = hex.replace('#', '')
    const num = parseInt(cleanHex, 16)
    const clamp = (v: number) => Math.min(255, Math.max(0, v))
    const r = clamp((num >> 16) + amount)
    const g = clamp(((num >> 8) & 0xff) + amount)
    const b = clamp((num & 0xff) + amount)
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

const isHexLight = (hex: string): boolean => {
    const cleanHex = hex.replace('#', '')
    const num = parseInt(cleanHex, 16)
    const r = (num >> 16) & 0xff
    const g = (num >> 8) & 0xff
    const b = num & 0xff
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6
}

export const deriveKonsoleBackground = (bg: string): string =>
    isHexLight(bg) ? adjustHexBrightness(bg, -16) : adjustHexBrightness(bg, 12)

export interface Hsv {
    h: number
    s: number
    v: number
}

export const hexToHsv = (hex: string): Hsv => {
    const clean = hex.replace('#', '')
    const num = parseInt(clean, 16)
    const r = ((num >> 16) & 0xff) / 255
    const g = ((num >> 8) & 0xff) / 255
    const b = (num & 0xff) / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min
    let h = 0
    if (delta !== 0) {
        if (max === r) h = ((g - b) / delta) % 6
        else if (max === g) h = (b - r) / delta + 2
        else h = (r - g) / delta + 4
        h *= 60
        if (h < 0) h += 360
    }
    return { h, s: max === 0 ? 0 : delta / max, v: max }
}

export interface Hsl {
    h: number
    s: number
    l: number
}

export const hsvToHsl = ({ h, s, v }: Hsv): Hsl => {
    const l = v * (1 - s / 2)
    const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l)
    return { h, s: sl * 100, l: l * 100 }
}

export const hslToHsv = ({ h, s, l }: Hsl): Hsv => {
    const sn = s / 100
    const ln = l / 100
    const v = ln + sn * Math.min(ln, 1 - ln)
    const sv = v === 0 ? 0 : 2 * (1 - ln / v)
    return { h, s: sv, v }
}

// source https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/named-color
const CSS_NAMED_COLORS: Record<string, string> = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgreen: '#006400',
    darkgrey: '#a9a9a9',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    gold: '#ffd700',
    goldenrod: '#daa520',
    gray: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    grey: '#808080',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    lavenderblush: '#fff0f5',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgreen: '#90ee90',
    lightgrey: '#d3d3d3',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    rebeccapurple: '#663399',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32',
}

export const resolveColorInput = (raw: string): string | null => {
    const cleaned = raw.trim().toLowerCase().replace(/^#/, '')
    if (/^[0-9a-f]{6}$/.test(cleaned)) return `#${cleaned}`
    if (/^[0-9a-f]{3}$/.test(cleaned)) {
        const [r, g, b] = cleaned.split('')
        return `#${r}${r}${g}${g}${b}${b}`
    }
    return CSS_NAMED_COLORS[cleaned] ?? null
}

export const hsvToHex = (h: number, s: number, v: number): string => {
    const channel = (n: number) => {
        const k = (n + h / 60) % 6
        const value = v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
        return Math.round(value * 255)
            .toString(16)
            .padStart(2, '0')
    }
    return `#${channel(5)}${channel(3)}${channel(1)}`
}

// ---- WCAG contrast -------------------------------------------------------------

export const relativeLuminance = (hex: string): number => {
    const clean = hex.replace('#', '')
    const channel = (i: number) => {
        const raw = parseInt(clean.slice(i * 2, i * 2 + 2), 16) / 255
        return raw <= 0.03928 ? raw / 12.92 : ((raw + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2)
}

/** WCAG contrast ratio between two hex colors (range 1 … 21). */
export const contrastRatio = (a: string, b: string): number => {
    const la = relativeLuminance(a)
    const lb = relativeLuminance(b)
    const [lighter, darker] = la >= lb ? [la, lb] : [lb, la]
    return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Nudges an HSL accent's lightness until it reaches the target contrast ratio
 * against `backgroundHex`. `stepUp` moves toward lighter values on dark
 * backgrounds and toward darker values on light backgrounds.
 */
export const ensureContrast = (
    accent: { h: number; s: number; l: number },
    backgroundHex: string,
    stepUp: boolean,
    target = 4.5,
    maxIterations = 12
): { h: number; s: number; l: number } => {
    let tuned = { ...accent }
    for (
        let i = 0;
        i < maxIterations &&
        contrastRatio(hsvToHex(hslToHsv(tuned).h, hslToHsv(tuned).s, hslToHsv(tuned).v), backgroundHex) < target;
        i++
    ) {
        tuned = { ...tuned, l: Math.min(96, Math.max(4, tuned.l + (stepUp ? 2.5 : -2.5))) }
    }
    return tuned
}
