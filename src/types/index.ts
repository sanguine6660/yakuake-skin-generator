/**
 * @file src/types/index.ts
 * @description TypeScript type definitions for the Yakuake Skin Generator
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

export type IconLibrary =
    | 'lucide'
    | 'fa'
    | 'fa6'
    | 'io'
    | 'io5'
    | 'md'
    | 'ti'
    | 'go'
    | 'fi'
    | 'gi'
    | 'wi'
    | 'di'
    | 'ai'
    | 'bs'
    | 'ri'
    | 'fc'
    | 'gr'
    | 'hi'
    | 'hi2'
    | 'si'
    | 'sl'
    | 'im'
    | 'bi'
    | 'cg'
    | 'vsc'
    | 'tb'
    | 'tfi'
    | 'pi'

export type IconRole = 'settings' | 'maximize' | 'close' | 'plus' | 'minus' | 'lock'

export interface IconSet {
    settings: string
    maximize: string
    close: string
    plus: string
    minus: string
    lock: string
}

export interface RgbColor {
    r: number
    g: number
    b: number
}

export interface SkinMeta {
    skinName: string
    author: string
    email: string
    web?: string
    icon: string
}

export interface ButtonConfig {
    enabled: boolean
    x: number
    y: number
    /** Title buttons only: side from which `x` is measured (Yakuake default: right) */
    anchor?: 'left' | 'right'
    /** PlusButton only: follow the last tab instead of a fixed position */
    atEndOfTabs?: boolean
    up: string
    over: string
    down: string
}

export interface TitleConfig {
    meta: SkinMeta

    borderColor: RgbColor
    borderWidth: number

    textX: number
    textY: number
    textColor: RgbColor
    textContent: string
    textBold: boolean
    /** Center the text horizontally when it fits (Yakuake `[Text] centered`) */
    centered?: boolean

    bgCenter: string
    bgLeft: string
    bgRight: string
    bgTranslucent?: boolean

    titleEnabled: boolean

    focusBtn: ButtonConfig
    configBtn: ButtonConfig
    quitBtn: ButtonConfig
}

export interface TabsConfig {
    meta: SkinMeta

    tabsX: number
    tabsY: number
    selectedColor: RgbColor
    unselectedColor: RgbColor

    separatorImage?: string
    selectedLeft: string
    selectedMiddle: string
    selectedRight: string
    unselectedLeft: string
    unselectedMiddle: string
    unselectedRight: string

    preventClosingImage: string
    preventClosingImageX?: number
    preventClosingImageY?: number
    selectedTextBold?: boolean
    compact?: boolean
    lockEnabled: boolean

    bgCenter: string
    bgLeft: string
    bgRight: string
    bgTranslucent?: boolean

    tabsEnabled: boolean

    plusBtn: ButtonConfig
    minusBtn: ButtonConfig
    closeBtn: ButtonConfig
    lockBtn: ButtonConfig
}

/** A Konsole colorscheme: 20 slots in three intensities + general settings. */
export interface TerminalColorscheme {
    /** Master switch: emit/sync the companion scheme (default true) */
    enabled?: boolean
    /** Shown in Konsole's scheme dropdown; defaults to "<skin name> Terminal" */
    description?: string
    /** 0–100 (emitted as 0.0–1.0) */
    opacity: number

    background: RgbColor
    backgroundIntense: RgbColor
    backgroundFaint: RgbColor
    foreground: RgbColor
    foregroundIntense: RgbColor
    foregroundFaint: RgbColor

    /** ANSI slots 0–7 (black, red, green, yellow, blue, magenta, cyan, white) */
    ansi: RgbColor[]
    ansiIntense: RgbColor[]
    ansiFaint: RgbColor[]
}

export interface ButtonStateColors {
    upBg: string
    upIcon: string
    overBg: string
    overIcon: string
    downBg: string
    downIcon: string
}

export interface ButtonColors {
    focus: ButtonStateColors
    config: ButtonStateColors
    quit: ButtonStateColors
    plus: ButtonStateColors
    minus: ButtonStateColors
    close: ButtonStateColors
}

export interface SkinConfig {
    meta: SkinMeta
    title: Omit<TitleConfig, 'meta'>
    tabs: Omit<TabsConfig, 'meta'>
    global: {
        iconLibrary: IconLibrary
        iconSet: IconSet
        colors: {
            bg: string
            selected: string
            text: string
            dim: string
            konsoleBackground: string
        }
        buttonColors: ButtonColors
        borderRadius: number
        opacity: number
        translucency: boolean
    }
    /** Konsole companion scheme; derived from the palette when absent */
    terminal?: TerminalColorscheme
}

export type ConfigSection = 'meta' | 'global' | 'title' | 'tabs'

export interface SavedSkin {
    name: string
    config: SkinConfig
    createdAt: number
    updatedAt: number
}

export interface FormField {
    key: string
    label: string
    type: 'text' | 'number' | 'color' | 'select' | 'checkbox' | 'rgb-color'
    min?: number
    max?: number
    step?: number
    placeholder?: string
    options?: { value: string; label: string }[]
}
