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
            colors,
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
        description: 'Warm coffee with creamy pastels',
        previewColors: { bg: '#eff1f5', selected: '#e6e9ef', text: '#4c4f69', dim: '#dce0e8' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#eff1f5', selected: '#e6e9ef', text: '#4c4f69', dim: '#dce0e8' },
            6,
            'hi2',
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
        description: 'Precision colors for machines and people',
        previewColors: { bg: '#fdf6e3', selected: '#eee8d5', text: '#657b83', dim: '#93a1a1' },
        category: 'light',
        config: createPresetConfig(
            { bg: '#fdf6e3', selected: '#eee8d5', text: '#657b83', dim: '#93a1a1' },
            4,
            'fa6',
            'Solarized Light',
            true
        ),
    },
]

export const PRESETS = [...DARK_PRESETS, ...LIGHT_PRESETS]

export const getPresetsByCategory = (category: 'dark' | 'light'): SkinPreset[] => {
    return PRESETS.filter((p) => p.category === category)
}
