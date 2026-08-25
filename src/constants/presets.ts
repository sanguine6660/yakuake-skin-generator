/**
 * @file src/constants/presets.ts
 * @description Pre-defined color theme presets (10 dark + 10 light) for quick skin creation
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

import type { RgbColor, SkinConfig } from '../types'
import { DEFAULT_ICON_SETS, DEFAULT_TITLE_CONFIG, DEFAULT_TABS_CONFIG } from './constants'
import { deriveKonsoleBackground } from '../utils/colors'

export interface SkinPreset {
    id: string
    name: string
    description: string
    previewColors: {
        bg: string
        selected: string
        text: string
        dim: string
    }
    category: 'dark' | 'light'
    config: Partial<SkinConfig>
}

const baseGlobal = {
    opacity: 100,
    translucency: false,
}

const hexToRgb = (hex: string): RgbColor => {
    const cleanHex = hex.replace('#', '')
    return {
        r: parseInt(cleanHex.substring(0, 2), 16) || 0,
        g: parseInt(cleanHex.substring(2, 4), 16) || 0,
        b: parseInt(cleanHex.substring(4, 6), 16) || 0,
    }
}

interface PresetPalette {
    bg: string
    selected: string
    text: string
    dim: string
}

const createButtonState = (colors: PresetPalette) => ({
    upBg: colors.dim,
    upIcon: colors.text,
    overBg: colors.selected,
    overIcon: colors.text,
    downBg: colors.text,
    downIcon: colors.bg,
})

const createPresetConfig = (
    colors: PresetPalette,
    borderRadius: number,
    iconLibrary: keyof typeof DEFAULT_ICON_SETS,
    textContent: string,
    textBold: boolean
): Partial<SkinConfig> => {
    const buttonState = createButtonState(colors)
    return {
        global: {
            colors: { ...colors, konsoleBackground: deriveKonsoleBackground(colors.bg) },
            borderRadius,
            iconLibrary,
            iconSet: DEFAULT_ICON_SETS[iconLibrary],
            buttonColors: {
                focus: { ...buttonState },
                config: { ...buttonState },
                quit: { ...buttonState, downBg: '#bf616a', downIcon: '#ffffff' },
                plus: { ...buttonState },
                minus: { ...buttonState },
                close: { ...buttonState },
            },
            ...baseGlobal,
        },
        title: {
            ...DEFAULT_TITLE_CONFIG,
            textColor: hexToRgb(colors.text),
            textContent,
            textBold,
        },
        tabs: {
            ...DEFAULT_TABS_CONFIG,
            selectedColor: hexToRgb(colors.text),
        },
    }
}

const DARK_PRESETS: SkinPreset[] = [
    {
        id: 'midnight',
        name: 'Midnight',
        description: 'Deep blue darkness with cyan accents',
        previewColors: { bg: '#0d1117', selected: '#161b22', text: '#58a6ff', dim: '#21262d' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#0d1117', selected: '#161b22', text: '#58a6ff', dim: '#21262d' },
            6,
            'lucide',
            'Midnight',
            true
        ),
    },
    {
        id: 'dracula',
        name: 'Dracula',
        description: 'Classic Dracula theme with purple highlights',
        previewColors: { bg: '#282a36', selected: '#44475a', text: '#bd93f9', dim: '#3a3c4e' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#282a36', selected: '#44475a', text: '#bd93f9', dim: '#3a3c4e' },
            4,
            'fa6',
            'Dracula',
            true
        ),
    },
    {
        id: 'nord',
        name: 'Nord',
        description: 'Arctic ice colors with frosty blues',
        previewColors: { bg: '#2e3440', selected: '#3b4252', text: '#88c0d0', dim: '#434c5e' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#2e3440', selected: '#3b4252', text: '#88c0d0', dim: '#434c5e' },
            4,
            'lucide',
            'Nord',
            true
        ),
    },
    {
        id: 'tokyo-night',
        name: 'Tokyo Night',
        description: 'Neon Tokyo streets at midnight',
        previewColors: { bg: '#1a1b26', selected: '#24283b', text: '#7aa2f7', dim: '#16161e' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#1a1b26', selected: '#24283b', text: '#7aa2f7', dim: '#16161e' },
            8,
            'ri',
            'Tokyo Night',
            true
        ),
    },
    {
        id: 'catppuccin-mocha',
        name: 'Catppuccin Mocha',
        description: 'Warm coffee tones with mauve accents',
        previewColors: { bg: '#1e1e2e', selected: '#313244', text: '#cba6f7', dim: '#181825' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#1e1e2e', selected: '#313244', text: '#cba6f7', dim: '#181825' },
            6,
            'hi2',
            'Catppuccin Mocha',
            true
        ),
    },
    {
        id: 'rose-pine',
        name: 'Rose Pine',
        description: 'Pine forest at dawn with rose highlights',
        previewColors: { bg: '#191724', selected: '#1f1d2e', text: '#ebbcba', dim: '#26233a' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#191724', selected: '#1f1d2e', text: '#ebbcba', dim: '#26233a' },
            5,
            'fi',
            'Rose Pine',
            true
        ),
    },
    {
        id: 'gruvbox',
        name: 'Gruvbox Dark',
        description: 'Retro groove with warm earth tones',
        previewColors: { bg: '#282828', selected: '#3c3836', text: '#fabd2f', dim: '#504945' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#282828', selected: '#3c3836', text: '#fabd2f', dim: '#504945' },
            3,
            'tb',
            'Gruvbox',
            false
        ),
    },
    {
        id: 'everforest',
        name: 'Everforest',
        description: 'Deep forest greens with soft contrast',
        previewColors: { bg: '#2d353b', selected: '#343f44', text: '#a7c080', dim: '#272e33' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#2d353b', selected: '#343f44', text: '#a7c080', dim: '#272e33' },
            6,
            'gi',
            'Everforest',
            true
        ),
    },
    {
        id: 'kanagawa',
        name: 'Kanagawa',
        description: 'Japanese waves with dragon colors',
        previewColors: { bg: '#1f1f28', selected: '#2a2a37', text: '#7e9cd8', dim: '#181820' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#1f1f28', selected: '#2a2a37', text: '#7e9cd8', dim: '#181820' },
            7,
            'ai',
            'Kanagawa',
            true
        ),
    },
    {
        id: 'github-dark',
        name: 'GitHub Dark',
        description: 'Clean developer aesthetic',
        previewColors: { bg: '#0d1117', selected: '#161b22', text: '#58a6ff', dim: '#21262d' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#0d1117', selected: '#161b22', text: '#58a6ff', dim: '#21262d' },
            6,
            'vsc',
            'GitHub Dark',
            true
        ),
    },
    {
        id: 'solarized-dark',
        name: 'Solarized Dark',
        description: 'Precision low-contrast teal and blue tones',
        previewColors: { bg: '#002b36', selected: '#073642', text: '#268bd2', dim: '#001e26' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#002b36', selected: '#073642', text: '#268bd2', dim: '#001e26' },
            4,
            'fa6',
            'Solarized Dark',
            true
        ),
    },
    {
        id: 'one-dark',
        name: 'One Dark Pro',
        description: 'Iconic Atom-inspired dark blue syntax theme',
        previewColors: { bg: '#282c34', selected: '#3e4451', text: '#61afef', dim: '#21252b' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#282c34', selected: '#3e4451', text: '#61afef', dim: '#21252b' },
            6,
            'vsc',
            'One Dark',
            true
        ),
    },
    {
        id: 'monokai-pro',
        name: 'Monokai Pro',
        description: 'Refined dark filter with vibrant warm accents',
        previewColors: { bg: '#2d2a2e', selected: '#403e41', text: '#ffd866', dim: '#221f22' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#2d2a2e', selected: '#403e41', text: '#ffd866', dim: '#221f22' },
            4,
            'lucide',
            'Monokai Pro',
            true
        ),
    },
    {
        id: 'synthwave-84',
        name: "SynthWave '84",
        description: 'Retro 80s neon glow with deep purple synth vibes',
        previewColors: { bg: '#262335', selected: '#34294f', text: '#ff7edb', dim: '#1a1826' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#262335', selected: '#34294f', text: '#ff7edb', dim: '#1a1826' },
            8,
            'ri',
            "SynthWave '84",
            true
        ),
    },
    {
        id: 'night-owl',
        name: 'Night Owl',
        description: 'Deep midnight blue optimized for night owls',
        previewColors: { bg: '#011627', selected: '#1d3b53', text: '#82aaff', dim: '#0b253a' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#011627', selected: '#1d3b53', text: '#82aaff', dim: '#0b253a' },
            6,
            'hi2',
            'Night Owl',
            true
        ),
    },
    {
        id: 'catppuccin-macchiato',
        name: 'Catppuccin Macchiato',
        description: 'Medium dark pastel coffee palette',
        previewColors: { bg: '#24273a', selected: '#363a4f', text: '#f5bde6', dim: '#1e2030' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#24273a', selected: '#363a4f', text: '#f5bde6', dim: '#1e2030' },
            6,
            'hi2',
            'Catppuccin Macchiato',
            true
        ),
    },
    {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        description: 'High-contrast high-tech electric cyan and yellow',
        previewColors: { bg: '#120e16', selected: '#231830', text: '#00f0ff', dim: '#1c122c' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#120e16', selected: '#231830', text: '#00f0ff', dim: '#1c122c' },
            2,
            'si',
            'Cyberpunk',
            false
        ),
    },
    {
        id: 'cobalt2',
        name: 'Cobalt2',
        description: 'Vibrant yellow on intense blue background',
        previewColors: { bg: '#193549', selected: '#15232d', text: '#ffc600', dim: '#0d1d29' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#193549', selected: '#15232d', text: '#ffc600', dim: '#0d1d29' },
            6,
            'tb',
            'Cobalt2',
            true
        ),
    },
    {
        id: 'ayu-dark',
        name: 'Ayu Dark',
        description: 'Sleek matte dark theme with golden orange accents',
        previewColors: { bg: '#0f1419', selected: '#1f2430', text: '#ffb454', dim: '#14191f' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#0f1419', selected: '#1f2430', text: '#ffb454', dim: '#14191f' },
            5,
            'fi',
            'Ayu Dark',
            true
        ),
    },
    {
        id: 'horizon-dark',
        name: 'Horizon Dark',
        description: 'Warm dark space theme with crimson highlights',
        previewColors: { bg: '#1c1e26', selected: '#232530', text: '#e95678', dim: '#16171d' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#1c1e26', selected: '#232530', text: '#e95678', dim: '#16171d' },
            6,
            'gi',
            'Horizon Dark',
            true
        ),
    },
    {
        id: 'arc-dark',
        name: 'Arc Dark',
        description: 'Popular Linux desktop theme with cool blue-grays',
        previewColors: { bg: '#2f343f', selected: '#383c4a', text: '#5294e2', dim: '#22252e' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#2f343f', selected: '#383c4a', text: '#5294e2', dim: '#22252e' },
            5,
            'lucide',
            'Arc Dark',
            true
        ),
    },
    {
        id: 'material-palenight',
        name: 'Material Palenight',
        description: 'Soothing Material Design variant for night coding',
        previewColors: { bg: '#292d3e', selected: '#32374d', text: '#82aaff', dim: '#1b1e2b' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#292d3e', selected: '#32374d', text: '#82aaff', dim: '#1b1e2b' },
            6,
            'hi2',
            'Material Palenight',
            true
        ),
    },
    {
        id: 'deep-space',
        name: 'Deep Space',
        description: 'Cosmic dark theme with icy teal highlights',
        previewColors: { bg: '#151a21', selected: '#1b222d', text: '#4bb1b7', dim: '#0e1217' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#151a21', selected: '#1b222d', text: '#4bb1b7', dim: '#0e1217' },
            7,
            'ri',
            'Deep Space',
            true
        ),
    },
    {
        id: 'zenburn',
        name: 'Zenburn',
        description: 'Low-contrast, easy-on-the-eyes muted earthy palette',
        previewColors: { bg: '#3f3f3f', selected: '#4f4f4f', text: '#dcdccc', dim: '#313131' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#3f3f3f', selected: '#4f4f4f', text: '#dcdccc', dim: '#313131' },
            3,
            'tb',
            'Zenburn',
            true
        ),
    },
    {
        id: 'matrix',
        name: 'Matrix',
        description: 'Classic hacker terminal with deep black and digital green',
        previewColors: { bg: '#050505', selected: '#0f140f', text: '#00ff66', dim: '#020802' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#050505', selected: '#0f140f', text: '#00ff66', dim: '#020802' },
            2,
            'si',
            'Matrix',
            false
        ),
    },
    {
        id: 'oceanic-next',
        name: 'Oceanic Next',
        description: 'Deep sea inspired variant of the classic Tomorrow Night',
        previewColors: { bg: '#1b2b34', selected: '#343d46', text: '#6699cc', dim: '#11191f' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#1b2b34', selected: '#343d46', text: '#6699cc', dim: '#11191f' },
            6,
            'vsc',
            'Oceanic Next',
            true
        ),
    },
    {
        id: 'laserwave',
        name: 'LaserWave',
        description: 'Darksynth aesthetic with deep indigo and blazing magenta',
        previewColors: { bg: '#161329', selected: '#272145', text: '#eb64b9', dim: '#0e0c1a' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#161329', selected: '#272145', text: '#eb64b9', dim: '#0e0c1a' },
            8,
            'ai',
            'LaserWave',
            true
        ),
    },
    {
        id: 'duotone-dark',
        name: 'Duotone Dark',
        description: 'Minimalist two-tone dark scheme with warm ochre accents',
        previewColors: { bg: '#1f2022', selected: '#2d2e31', text: '#ffc83f', dim: '#141517' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#1f2022', selected: '#2d2e31', text: '#ffc83f', dim: '#141517' },
            4,
            'fi',
            'Duotone Dark',
            true
        ),
    },
    {
        id: 'spaceduck',
        name: 'Spaceduck',
        description: 'Intergalactic palette with atomic purple and yellow skies',
        previewColors: { bg: '#16172d', selected: '#292b4d', text: '#00f3bb', dim: '#0e0f1d' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#16172d', selected: '#292b4d', text: '#00f3bb', dim: '#0e0f1d' },
            6,
            'gi',
            'Spaceduck',
            true
        ),
    },
    {
        id: 'vesper',
        name: 'Vesper',
        description: 'Deep obsidian dark mode with muted warm amber notes',
        previewColors: { bg: '#101010', selected: '#1c1c1c', text: '#ffc799', dim: '#080808' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#101010', selected: '#1c1c1c', text: '#ffc799', dim: '#080808' },
            4,
            'fa6',
            'Vesper',
            true
        ),
    },
    {
        id: 'tokyo-night-storm',
        name: 'Tokyo Night Storm',
        description:
            'Cleaner, slightly brighter variant of Tokyo Night with a deep storm-blue background',
        previewColors: { bg: '#24283b', selected: '#32344a', text: '#7aa2f7', dim: '#1f2335' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#24283b', selected: '#32344a', text: '#7aa2f7', dim: '#1f2335' },
            8,
            'ri',
            'Tokyo Night Storm',
            true
        ),
    },
    {
        id: 'shades-of-purple',
        name: 'Shades of Purple',
        description: 'Vibrant, high-contrast purple theme with neon pink and yellow accents',
        previewColors: { bg: '#1e1e3f', selected: '#2d2b55', text: '#fad000', dim: '#151530' },
        category: 'dark',
        config: createPresetConfig(
            { bg: '#1e1e3f', selected: '#2d2b55', text: '#fad000', dim: '#151530' },
            6,
            'vsc',
            'Shades of Purple',
            true
        ),
    },
]

const LIGHT_PRESETS: SkinPreset[] = [
    {
        id: 'github-light',
        name: 'GitHub Light',
        description: 'Clean light developer aesthetic',
        previewColors: { bg: '#ffffff', selected: '#f6f8fa', text: '#24292e', dim: '#f3f4f6' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#ffffff', selected: '#f6f8fa', text: '#24292e', dim: '#f3f4f6' },
            6,
            'vsc',
            'GitHub Light',
            true
        ),
    },
    {
        id: 'catppuccin-latte',
        name: 'Catppuccin Latte',
        description: 'Soothing pastel-infused light theme designed for maximum visual comfort',
        previewColors: { bg: '#eff1f5', selected: '#ccd0da', text: '#1e66f5', dim: '#acb0be' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#eff1f5', selected: '#ccd0da', text: '#1e66f5', dim: '#acb0be' },
            6,
            'fa6',
            'Catppuccin Latte',
            true
        ),
    },
    {
        id: 'rose-pine-dawn',
        name: 'Rose Pine Dawn',
        description: 'Morning pine with soft rose tones',
        previewColors: { bg: '#faf4ed', selected: '#f2e9e1', text: '#575279', dim: '#e8dce8' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#faf4ed', selected: '#f2e9e1', text: '#575279', dim: '#e8dce8' },
            5,
            'fi',
            'Rose Pine Dawn',
            true
        ),
    },
    {
        id: 'catppuccin-frappe',
        name: 'Catppuccin Frappé',
        description: 'Cool coffee with muted tones',
        previewColors: { bg: '#e0e0e0', selected: '#d0d0d0', text: '#303446', dim: '#c6c6c6' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#e0e0e0', selected: '#d0d0d0', text: '#303446', dim: '#c6c6c6' },
            6,
            'hi2',
            'Catppuccin Frappé',
            true
        ),
    },
    {
        id: 'tokyo-day',
        name: 'Tokyo Day',
        description: 'Bright Tokyo daylight theme',
        previewColors: { bg: '#e1e2e7', selected: '#d5d6db', text: '#3760bf', dim: '#cbcdd1' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#e1e2e7', selected: '#d5d6db', text: '#3760bf', dim: '#cbcdd1' },
            8,
            'ri',
            'Tokyo Day',
            true
        ),
    },
    {
        id: 'everforest-light',
        name: 'Everforest Light',
        description: 'Bright forest with natural greens',
        previewColors: { bg: '#f3f0ed', selected: '#e6e2dc', text: '#3a5e4e', dim: '#d3cbc6' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#f3f0ed', selected: '#e6e2dc', text: '#3a5e4e', dim: '#d3cbc6' },
            6,
            'gi',
            'Everforest Light',
            true
        ),
    },
    {
        id: 'kanagawa-light',
        name: 'Kanagawa Light',
        description: 'Japanese waves in daylight',
        previewColors: { bg: '#eaeaea', selected: '#dcdcdc', text: '#3d6b99', dim: '#c8c8c8' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#eaeaea', selected: '#dcdcdc', text: '#3d6b99', dim: '#c8c8c8' },
            7,
            'ai',
            'Kanagawa Light',
            true
        ),
    },
    {
        id: 'nord-light',
        name: 'Nord Light',
        description: 'Arctic light with frosty blues',
        previewColors: { bg: '#eceff4', selected: '#d8dee9', text: '#3b4252', dim: '#b4bdc8' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#eceff4', selected: '#d8dee9', text: '#3b4252', dim: '#b4bdc8' },
            4,
            'lucide',
            'Nord Light',
            true
        ),
    },
    {
        id: 'gruvbox-light',
        name: 'Gruvbox Light',
        description: 'Retro light with warm earth tones',
        previewColors: { bg: '#fbf1c7', selected: '#ebdbb2', text: '#3c3836', dim: '#d5c4a1' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#fbf1c7', selected: '#ebdbb2', text: '#3c3836', dim: '#d5c4a1' },
            3,
            'tb',
            'Gruvbox Light',
            false
        ),
    },
    {
        id: 'solarized-light',
        name: 'Solarized Light',
        description: 'Precision-designed low-contrast light palette with warm tones',
        previewColors: { bg: '#fdf6e3', selected: '#eee8d5', text: '#2aa198', dim: '#93a1a1' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#fdf6e3', selected: '#eee8d5', text: '#2aa198', dim: '#93a1a1' },
            4,
            'hi2',
            'Solarized Light',
            true
        ),
    },
    {
        id: 'one-light',
        name: 'One Light',
        description: 'Clean Atom light theme with soft blue highlights',
        previewColors: { bg: '#fafafa', selected: '#eaeaeb', text: '#4078f2', dim: '#dbdbdc' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#fafafa', selected: '#eaeaeb', text: '#4078f2', dim: '#dbdbdc' },
            6,
            'vsc',
            'One Light',
            true
        ),
    },
    {
        id: 'ayu-light',
        name: 'Ayu Light',
        description: 'Bright and clear aesthetic with soft peach accents',
        previewColors: { bg: '#fcfcfc', selected: '#f3f4f5', text: '#f29e74', dim: '#e7e8e9' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#fcfcfc', selected: '#f3f4f5', text: '#f29e74', dim: '#e7e8e9' },
            5,
            'fi',
            'Ayu Light',
            true
        ),
    },
    {
        id: 'papercolor-light',
        name: 'PaperColor Light',
        description:
            'Inspired by traditional print books with crisp dark text and soft paper background',
        previewColors: { bg: '#eeeeee', selected: '#e0e0e0', text: '#005f87', dim: '#c6c6c6' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#eeeeee', selected: '#e0e0e0', text: '#005f87', dim: '#c6c6c6' },
            3,
            'tb',
            'PaperColor Light',
            true
        ),
    },
    {
        id: 'quiet-light',
        name: 'Quiet Light',
        description: 'Soft pastel purple and grey muted theme',
        previewColors: { bg: '#f5f5f5', selected: '#e0e0e0', text: '#7a3e9d', dim: '#d6d6d6' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#f5f5f5', selected: '#e0e0e0', text: '#7a3e9d', dim: '#d6d6d6' },
            6,
            'lucide',
            'Quiet Light',
            true
        ),
    },
    {
        id: 'flexoki-light',
        name: 'Flexoki Light',
        description: 'Inky warm paper theme for long reading sessions',
        previewColors: { bg: '#fffcf0', selected: '#f2efdf', text: '#205ea6', dim: '#e6e4d5' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#fffcf0', selected: '#f2efdf', text: '#205ea6', dim: '#e6e4d5' },
            4,
            'gi',
            'Flexoki Light',
            true
        ),
    },
    {
        id: 'horizon-light',
        name: 'Horizon Light',
        description: 'Warm coral and warm beige morning light',
        previewColors: { bg: '#fdf0ed', selected: '#f9ded7', text: '#da103f', dim: '#f0cfc7' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#fdf0ed', selected: '#f9ded7', text: '#da103f', dim: '#f0cfc7' },
            6,
            'ri',
            'Horizon Light',
            true
        ),
    },
    {
        id: 'material-light',
        name: 'Material Light',
        description: 'Google Material Design light specification',
        previewColors: { bg: '#fafafa', selected: '#e0e0e0', text: '#6182b8', dim: '#cfcfcf' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#fafafa', selected: '#e0e0e0', text: '#6182b8', dim: '#cfcfcf' },
            6,
            'hi2',
            'Material Light',
            true
        ),
    },
    {
        id: 'vivid-light',
        name: 'Vivid Light',
        description: 'Crisp slate-white background with electric blue text',
        previewColors: { bg: '#f4f6f9', selected: '#e2e7f0', text: '#0088ff', dim: '#d0d7e5' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#f4f6f9', selected: '#e2e7f0', text: '#0088ff', dim: '#d0d7e5' },
            8,
            'ai',
            'Vivid Light',
            true
        ),
    },
    {
        id: 'cupcake-light',
        name: 'Cupcake Light',
        description: 'Playful pink and berry pastel tones',
        previewColors: { bg: '#faf8f8', selected: '#efe2e8', text: '#d85d8e', dim: '#e5d4dc' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#faf8f8', selected: '#efe2e8', text: '#d85d8e', dim: '#e5d4dc' },
            8,
            'fi',
            'Cupcake Light',
            true
        ),
    },
    {
        id: 'monokai-light',
        name: 'Monokai Light',
        description: 'Clean off-white canvas with dark high-contrast accents',
        previewColors: { bg: '#fcfcfa', selected: '#f4f4f0', text: '#2d2a2e', dim: '#e8e8e3' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#fcfcfa', selected: '#f4f4f0', text: '#2d2a2e', dim: '#e8e8e3' },
            4,
            'lucide',
            'Monokai Light',
            true
        ),
    },
    {
        id: 'material-lighter',
        name: 'Material Lighter',
        description: 'Bright, airy variation of the popular Material Design theme',
        previewColors: { bg: '#fafafa', selected: '#eceff1', text: '#6182b8', dim: '#cfd8dc' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#fafafa', selected: '#eceff1', text: '#6182b8', dim: '#cfd8dc' },
            6,
            'ri',
            'Material Lighter',
            true
        ),
    },
]

export const PRESETS = [...DARK_PRESETS, ...LIGHT_PRESETS]

export const getPresetsByCategory = (category: 'dark' | 'light'): SkinPreset[] => {
    return PRESETS.filter((p) => p.category === category)
}
