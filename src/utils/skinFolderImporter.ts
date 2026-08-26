/**
 * @file src/utils/skinFolderImporter.ts
 * @description Reverse-engineers an existing Yakuake skin folder (title.skin /
 * tabs.skin INI files + SVG assets) back into an editor SkinConfig. Skins that
 * contain the generator's metadata.json are restored with exact fidelity;
 * foreign skins are reconstructed best-effort by parsing the INI structure and
 * sampling colors from the generated assets.
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

import type { SkinConfig } from '../types'
import { createDefaultSkinConfig } from '../constants'
import { parseConfigJson } from './configSerialization'
import { primeIconMarkupCache } from './iconRenderer'
import { deriveColorscheme, parseColorschemeIni } from './konsoleScheme'

export interface SkinFolderFile {
    /** Path relative to the skin folder root, e.g. `title/focus_up.svg` */
    path: string
    content: Uint8Array
}

export interface ImportedSkin {
    config: SkinConfig
    fidelity: 'exact' | 'reconstructed'
    warnings: string[]
}

type IniSection = Record<string, string>
export type IniFile = Record<string, IniSection>

const decoder = new TextDecoder()

/**
 * Tolerant parser for KDE `.skin` INI files: `[Section]` headers followed by
 * `key=value` lines. Handles CRLF, UTF-8 BOM and stray whitespace; unknown
 * lines are ignored.
 */
export const parseSkinIni = (text: string): IniFile => {
    const ini: IniFile = {}
    let section: string | null = null

    for (const rawLine of text.replace(/^\uFEFF/, '').split(/\r?\n/)) {
        const line = rawLine.trim()
        if (!line) continue

        const header = line.match(/^\[(.+)\]$/)
        if (header) {
            section = header[1].trim()
            ini[section] ??= {}
            continue
        }
        if (!section) continue

        const eq = line.indexOf('=')
        if (eq <= 0) continue
        ini[section][line.slice(0, eq).trim()] = line.slice(eq + 1).trim()
    }

    return ini
}

/** First `#rrggbb` fill color found in an SVG document, or null. */
export const firstSvgFillHex = (svg: string): string | null =>
    svg.match(/fill="(#[0-9a-fA-F]{6})"/)?.[1]?.toLowerCase() ?? null

/**
 * Radius of the first arc command (`A r,r …`) in an SVG path — used to recover
 * the border radius from generated corner pieces.
 */
export const svgArcRadius = (svg: string): number | null => {
    const match = svg.match(/A\s*(\d+)\s*,\s*\1\b/i)
    return match ? Number(match[1]) : null
}

const isTranslucentCenter = (svg: string): boolean => /opacity="0\.85"/.test(svg)

interface ButtonSvgColors {
    bg: string | null
    icon: string | null
    markup: string | null
}

/**
 * Extracts background color, icon color and icon markup from a generated
 * button SVG (`<circle|rect fill=bg/><g …><icon paths/></g>`). The icon color
 * that replaced `currentColor` is substituted back so the recovered markup can
 * be re-rendered in any color.
 */
export const parseButtonSvg = (svg: string): ButtonSvgColors => {
    const shapeMatch = svg.match(/<(?:circle|rect)[^>]*\bfill="([^"]+)"/)
    const groupMatch = svg.match(/<g[^>]*>([\s\S]*)<\/g>/)

    let bg = shapeMatch?.[1]?.toLowerCase() ?? null
    if (bg === 'none') bg = null

    if (!groupMatch) return { bg, icon: null, markup: null }

    const openTag = groupMatch[0].match(/^<g[^>]*>/)?.[0] ?? ''
    const groupTag = groupMatch[0]
    const body = groupMatch[1]

    // Skip placeholder attributes (`fill="none"`) to find the real icon color;
    // scanning the whole <g> element covers markup that styles the group.
    let iconColor: string | null = null
    for (const match of groupTag.matchAll(/(?:stroke|fill)="([^"]+)"/g)) {
        const candidate = match[1].toLowerCase()
        if (candidate !== 'none' && candidate !== 'currentcolor') {
            iconColor = candidate
            break
        }
    }

    if (!iconColor) return { bg, icon: null, markup: body }

    // Restore the currentColor placeholder the generator substituted, whether
    // it lives on the paths themselves or on the wrapping <g> element.
    const colorInGroupTag = openTag.length > 0 && openTag.includes(iconColor)
    const restoredBody = body.split(iconColor).join('currentColor')
    const markup = colorInGroupTag
        ? `${openTag.split(iconColor).join('currentColor')}${restoredBody}</g>`
        : restoredBody

    return { bg, icon: iconColor, markup }
}

const num = (section: IniSection | null, key: string, fallback: number): number => {
    const value = Number(section?.[key])
    return Number.isFinite(value) ? value : fallback
}

const bool = (section: IniSection | null, key: string, fallback: boolean): boolean => {
    const value = section?.[key]
    if (value === undefined) return fallback
    return value.toLowerCase() === 'true'
}

const rgbFromIni = (
    section: IniSection | null,
    keys: [string, string, string]
): { r: number; g: number; b: number } => ({
    r: num(section, keys[0], 0),
    g: num(section, keys[1], 0),
    b: num(section, keys[2], 0),
})

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const clean = hex.replace('#', '')
    return {
        r: parseInt(clean.slice(0, 2), 16) || 0,
        g: parseInt(clean.slice(2, 4), 16) || 0,
        b: parseInt(clean.slice(4, 6), 16) || 0,
    }
}

const TITLE_BUTTONS = [
    { role: 'focus', section: 'FocusButton', iconName: 'maximize' },
    { role: 'config', section: 'ConfigButton', iconName: 'settings' },
    { role: 'quit', section: 'QuitButton', iconName: 'close' },
] as const

const TABS_BUTTONS = [
    { role: 'plus', section: 'PlusButton', iconName: 'plus' },
    { role: 'minus', section: 'MinusButton', iconName: 'minus' },
    { role: 'close', section: 'CloseButton', iconName: 'close' },
] as const

const ROLE_FILE_PREFIX: Record<string, string> = {
    focus: 'title/focus',
    config: 'title/config',
    quit: 'title/quit',
    plus: 'tabs/plus',
    minus: 'tabs/minus',
    close: 'tabs/close',
}

const fileText = (files: Map<string, SkinFolderFile>, path: string): string | null => {
    const file = files.get(path)
    return file ? decoder.decode(file.content) : null
}

const getSection = (ini: IniFile, name: string): IniSection | null => ini[name] ?? null

export const prettifyFolderName = (folder: string): string =>
    folder.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim() || 'Imported Skin'

/**
 * Normalizes arbitrary user-selected paths (`webkitRelativePath` includes the
 * picked folder name; archives may nest arbitrarily) into skin-root-relative
 * paths by anchoring on known skin entries.
 */
export const relativizePaths = (paths: string[]): Map<string, string> => {
    const anchor =
        /^(?:title(?:\/|\.skin$)|tabs(?:\/|\.skin$)|metadata\.json$|logo\.svg$|[^/]+\.colorscheme$)/
    const result = new Map<string, string>()

    for (const original of paths) {
        const segments = original.split(/[/\\]/)
        while (segments.length > 1 && !anchor.test(segments.slice(1).join('/'))) {
            segments.shift()
        }
        const rel = segments.length > 1 ? segments.slice(1).join('/') : segments[0]
        result.set(original, rel)
    }
    return result
}

/** Reconstructs a config purely from `.skin` INI files and SVG sampling. */
export const reconstructFromIni = (
    files: Map<string, SkinFolderFile>,
    folderName: string,
    warnings: string[]
): SkinConfig => {
    const defaults = createDefaultSkinConfig()
    const titleIniRaw = fileText(files, 'title.skin')
    const tabsIniRaw = fileText(files, 'tabs.skin')

    if (!titleIniRaw) throw new Error('title.skin not found in the selected folder')
    const titleIni = parseSkinIni(titleIniRaw)
    const tabsIni = tabsIniRaw ? parseSkinIni(tabsIniRaw) : {}

    const description = titleIni.Description ?? {}
    if (!description.Skin) {
        warnings.push('Skin name missing from title.skin — derived from the folder name.')
    }

    // ---- Global palette: sampled from generated assets ------------------
    const bgSvg = fileText(files, 'title/background_center.svg')
    const selectedSvg = fileText(files, 'tabs/tab_selected_middle.svg')
    const dimSvg = fileText(files, 'tabs/tab_unselected_middle.svg')
    const separatorSvg = fileText(files, 'tabs/tab_separator.svg')

    const bg = bgSvg ? firstSvgFillHex(bgSvg) : null
    const selected = selectedSvg ? firstSvgFillHex(selectedSvg) : null
    const dim = dimSvg ? firstSvgFillHex(dimSvg) : null
    const text = separatorSvg ? firstSvgFillHex(separatorSvg) : null

    const leftCornerSvg = fileText(files, 'title/background_left.svg')
    const borderRadius = leftCornerSvg ? (svgArcRadius(leftCornerSvg) ?? 0) : 0

    const config: SkinConfig = {
        ...defaults,
        meta: {
            skinName: description.Skin || prettifyFolderName(folderName),
            author: description.Author || defaults.meta.author,
            email: description.Email || '',
            web: description.Web || undefined,
            icon: '/logo.svg',
        },
        global: {
            ...defaults.global,
            colors: {
                bg: bg ?? defaults.global.colors.bg,
                selected: selected ?? defaults.global.colors.selected,
                text: text ?? defaults.global.colors.text,
                dim: dim ?? defaults.global.colors.dim,
                konsoleBackground: defaults.global.colors.konsoleBackground,
            },
            borderRadius,
            translucency: false,
            opacity: 100,
        },
    }

    warnings.push('Terminal background color is not stored in skin folders — using the default.')
    warnings.push(
        'Icon library and opacity cannot be recovered from skin folders — adjust in Global settings.'
    )

    // ---- Title bar ------------------------------------------------------
    const border = getSection(titleIni, 'Border')
    const text_ = getSection(titleIni, 'Text')
    const titleBg = getSection(titleIni, 'Background')

    const titleCenterSvg = fileText(files, 'title/background_center.svg')
    const titleTranslucent = titleCenterSvg ? isTranslucentCenter(titleCenterSvg) : false

    config.title = {
        ...defaults.title,
        borderColor: rgbFromIni(border, ['red', 'green', 'blue']),
        borderWidth: num(border, 'width', 0),
        textX: num(text_, 'x', defaults.title.textX),
        textY: num(text_, 'y', defaults.title.textY),
        textColor: rgbFromIni(text_, ['red', 'green', 'blue']),
        textContent: text_?.text ?? defaults.title.textContent,
        textBold: bool(text_, 'bold', true),
        centered: bool(text_, 'centered', false),
        bgCenter: titleBg?.back_image ?? defaults.title.bgCenter,
        bgLeft: titleBg?.left_corner ?? defaults.title.bgLeft,
        bgRight: titleBg?.right_corner ?? defaults.title.bgRight,
        bgTranslucent: titleTranslucent,
        titleEnabled: false,
    }

    // ---- Tab bar --------------------------------------------------------
    const tabs = getSection(tabsIni, 'Tabs')
    const tabsBg = getSection(tabsIni, 'Background')
    const tabsCenterSvg = fileText(files, 'tabs/background_center.svg')
    const tabsTranslucent = tabsCenterSvg ? isTranslucentCenter(tabsCenterSvg) : false

    config.tabs = {
        ...defaults.tabs,
        tabsX: num(tabs, 'x', defaults.tabs.tabsX),
        tabsY: num(tabs, 'y', defaults.tabs.tabsY),
        selectedColor: rgbFromIni(tabs, ['red', 'green', 'blue']),
        unselectedColor: dim ? hexToRgb(dim) : defaults.tabs.unselectedColor,
        separatorImage: tabs?.separator_image || undefined,
        selectedMiddle: tabs?.selected_background ?? defaults.tabs.selectedMiddle,
        selectedLeft: tabs?.selected_left_corner ?? defaults.tabs.selectedLeft,
        selectedRight: tabs?.selected_right_corner ?? defaults.tabs.selectedRight,
        unselectedMiddle: tabs?.unselected_background ?? defaults.tabs.unselectedMiddle,
        unselectedLeft: tabs?.unselected_left_corner ?? defaults.tabs.unselectedLeft,
        unselectedRight: tabs?.unselected_right_corner ?? defaults.tabs.unselectedRight,
        preventClosingImage: tabs?.prevent_closing_image ?? defaults.tabs.preventClosingImage,
        preventClosingImageX: num(tabs, 'prevent_closing_image_x', 0),
        preventClosingImageY: num(tabs, 'prevent_closing_image_y', 8),
        lockEnabled: Boolean(tabs?.prevent_closing_image),
        bgCenter: tabsBg?.back_image ?? defaults.tabs.bgCenter,
        bgLeft: tabsBg?.left_corner ?? defaults.tabs.bgLeft,
        bgRight: tabsBg?.right_corner ?? defaults.tabs.bgRight,
        selectedTextBold: bool(tabs, 'selected_text_bold', true),
        compact: bool(tabs, 'compact', false),
        bgTranslucent: tabsTranslucent,
        tabsEnabled: Boolean(tabsBg),
    }
    if (!tabsIniRaw) warnings.push('tabs.skin not found — tab bar restored with defaults.')

    // ---- Buttons ---------------------------------------------------------
    const applyButtons = (
        entries: ReadonlyArray<{ role: string; section: string; iconName: string }>,
        isTitle: boolean
    ) => {
        for (const { role, section, iconName } of entries) {
            const sec = getSection(titleIni, section) ?? getSection(tabsIni, section)
            const btn = {
                enabled: Boolean(sec),
                x: num(sec, 'x', 0),
                y: num(sec, 'y', 0),
                ...(isTitle ? { anchor: (sec?.anchor as 'left' | 'right') ?? 'right' } : {}),
                ...(!isTitle && role === 'plus'
                    ? { atEndOfTabs: bool(sec, 'at_end_of_tabs', false) }
                    : {}),
                up: sec?.up_image ?? '',
                over: sec?.over_image ?? '',
                down: sec?.down_image ?? '',
            }

            if (isTitle) {
                Object.assign(config.title, { [`${role}Btn`]: btn })
                if (btn.enabled) config.title.titleEnabled = true
            } else {
                Object.assign(config.tabs, { [`${role}Btn`]: btn })
            }

            // Sample state colors + icon markup from the generated SVGs.
            const prefix = ROLE_FILE_PREFIX[role]
            const stateColors: Record<string, string> = {}
            let recoveredMarkup: string | null = null
            for (const state of ['up', 'over', 'down'] as const) {
                const svg = fileText(files, `${prefix}_${state}.svg`)
                if (!svg) continue
                const parsed = parseButtonSvg(svg)
                if (parsed.bg) stateColors[`${state}Bg`] = parsed.bg
                if (parsed.icon) stateColors[`${state}Icon`] = parsed.icon
                if (state === 'up') recoveredMarkup = parsed.markup
            }
            Object.assign(config.global.buttonColors, {
                [role]: { ...defaults.global.buttonColors[role as 'focus'], ...stateColors },
            })

            if (recoveredMarkup && btn.enabled) {
                // The reconstructed config keeps the default iconSet names;
                // prime the cache under those so preview/export reuse the
                // original icon artwork.
                const iconSetName =
                    defaults.global.iconSet[iconName as keyof typeof defaults.global.iconSet]
                if (iconSetName) {
                    primeIconMarkupCache(config.global.iconLibrary, iconSetName, recoveredMarkup)
                }
            }
        }
    }

    applyButtons(TITLE_BUTTONS, true)
    applyButtons(TABS_BUTTONS, false)

    return config
}

/**
 * Imports a skin folder.
 *
 * - If the folder contains the generator's `metadata.json`, the stored
 *   configuration is restored exactly (including custom icon markup).
 * - Otherwise the `.skin` INI files are parsed and colors inferred from the
 *   SVG assets (best-effort reconstruction).
 */
export const importSkinFolder = (
    input: Array<{ path: string; content: Uint8Array }>
): ImportedSkin => {
    if (input.length === 0) throw new Error('The selected folder is empty.')

    const relMap = relativizePaths(input.map((f) => f.path))
    const files = new Map<string, SkinFolderFile>()
    for (const file of input) {
        const rel = relMap.get(file.path)!
        if (rel && !rel.includes('..')) files.set(rel, { path: rel, content: file.content })
    }

    const folderName =
        input[0]?.path.split(/[/\\]/).find((segment) => segment && segment !== '.') ??
        'Imported Skin'

    const metadataFile = files.get('metadata.json')
    if (metadataFile) {
        try {
            const metadataText = decoder.decode(metadataFile.content)
            const config = parseConfigJson(metadataText)

            const icons = (JSON.parse(metadataText).config?.icons as Record<string, string>) ?? {}
            for (const role of Object.keys(icons)) {
                const iconName = config.global.iconSet[role as keyof typeof config.global.iconSet]
                if (iconName) primeIconMarkupCache(config.global.iconLibrary, iconName, icons[role])
            }

            return { config, fidelity: 'exact', warnings: [] }
        } catch {
            // Corrupt metadata.json must not block structural recovery.
        }
    }

    const warnings: string[] = []
    const reconstructed = reconstructFromIni(files, folderName, warnings)

    // A shipped .colorscheme companion wins over palette derivation.
    const schemeEntry = [...files.entries()].find(([rel]) => rel.endsWith('.colorscheme'))
    if (schemeEntry) {
        try {
            reconstructed.terminal = parseColorschemeIni(
                decoder.decode(schemeEntry[1].content),
                deriveColorscheme(reconstructed)
            )
        } catch {
            warnings.push(
                'The included .colorscheme file could not be parsed — derived one instead.'
            )
        }
    }

    return { config: reconstructed, fidelity: 'reconstructed', warnings }
}
