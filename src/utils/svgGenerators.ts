/**
 * @file src/utils/svgGenerators.ts
 * @description Functions for programmatically generating all SVG assets for Yakuake skins
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

import type { SkinConfig } from '../types'
import { getIconPath } from './iconPaths'

export const generateBackgroundCenter = (
    color: string,
    height = 28,
    translucent = false
): string => {
    const opacity = translucent ? ' opacity="0.85"' : ''
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="${height}"${opacity}><rect width="1" height="${height}" fill="${color}"/></svg>`
}

export const generateBackgroundLeft = (
    color: string,
    height = 28,
    radius = 4,
    translucent = false
): string => {
    const opacity = translucent ? ' opacity="0.85"' : ''
    return `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="${height}"${opacity}><path d="M8,0 v${height} H${8 - radius} A${radius},${radius} 0 0,1 0,${height - radius} V${radius} A${radius},${radius} 0 0,1 ${8 - radius},0 Z" fill="${color}"/></svg>`
}

export const generateBackgroundRight = (
    color: string,
    height = 28,
    radius = 4,
    translucent = false
): string => {
    const opacity = translucent ? ' opacity="0.85"' : ''
    return `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="${height}"${opacity}><path d="M0,0 h${radius} a${radius},${radius} 0 0,1 ${radius},${radius} v${height - radius * 2} a${radius},${radius} 0 0,1 -${radius},${radius} H0 Z" fill="${color}"/></svg>`
}

export const generateButtonSvg = (
    iconName: string,
    bgColor: string,
    iconColor: string,
    size = 20,
    iconSize = 14,
    isCircle = true
): string => {
    const iconPath = getIconPath(iconName as keyof typeof import('./iconPaths').ICON_SVG_PATHS)
    const scale = iconSize / 24
    const translate = (size - 24 * scale) / 2
    const shape = isCircle
        ? `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 1}" fill="${bgColor}"/>`
        : `<rect width="${size}" height="${size}" rx="3" ry="3" fill="${bgColor}"/>`

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${shape}<g transform="translate(${translate}, ${translate}) scale(${scale})">${iconPath.replace(/currentColor/g, iconColor)}</g></svg>`
}

export const generateTabSelected = (config: SkinConfig, width = 120): string => {
    const { selected } = config.global.colors
    const radius = config.global.borderRadius
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="28"><rect width="${width}" height="28" rx="${radius}" ry="${radius}" fill="${selected}"/></svg>`
}

export const generateTabUnselected = (config: SkinConfig, width = 120): string => {
    const { dim } = config.global.colors
    const radius = config.global.borderRadius
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="28"><rect width="${width}" height="28" rx="${radius}" ry="${radius}" fill="${dim}"/></svg>`
}

export const generateTabPiece = (
    color: string,
    width: number,
    height = 28,
    radius = 4,
    isLeft: boolean,
    isMiddle: boolean
): string => {
    if (isMiddle) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="${color}"/></svg>`
    }
    if (isLeft) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><path d="M${width},0 v${height} H${width - radius} A${radius},${radius} 0 0,1 0,${height - radius} V${radius} A${radius},${radius} 0 0,1 ${width - radius},0 Z" fill="${color}"/></svg>`
    } else {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><path d="M0,0 h${radius} a${radius},${radius} 0 0,1 ${radius},${radius} v${height - radius * 2} a${radius},${radius} 0 0,1 -${radius},${radius} H0 Z" fill="${color}"/></svg>`
    }
}

export const generateSeparator = (color: string, height = 28): string => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="${height}"><rect width="1" height="${height}" fill="${color}"/></svg>`
}

export const generateLockSvg = (config: SkinConfig): string => {
    const { text } = config.global.colors
    return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><g transform="scale(0.5)">${getIconPath('lock').replace(/currentColor/g, text)}</g></svg>`
}

export const generateCloseButtonSvg = (
    bgColor: string,
    iconColor: string,
    size = 16,
    iconSize = 12
): string => {
    const iconPath = getIconPath('x')
    const scale = iconSize / 24
    const translate = (size - 24 * scale) / 2
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="3" ry="3" fill="${bgColor}"/><g transform="translate(${translate}, ${translate}) scale(${scale})">${iconPath.replace(/currentColor/g, iconColor)}</g></svg>`
}

export const generatePlusMinusSvg = (
    type: 'plus' | 'minus',
    bgColor: string,
    iconColor: string,
    size = 16
): string => {
    const iconPath = getIconPath(type)
    const scale = 0.5
    const translate = (size - 24 * scale) / 2
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="3" ry="3" fill="${bgColor}"/><g transform="translate(${translate}, ${translate}) scale(${scale})">${iconPath.replace(/currentColor/g, iconColor)}</g></svg>`
}

export const generateLogo = (config: SkinConfig): string => {
    const { bg, text } = config.global.colors
    return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <rect width="48" height="48" rx="10" fill="${bg}" stroke="${text}" stroke-width="2"/>
  <path d="M12 24 L20 32 L36 16" stroke="${text}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="24" cy="24" r="5" fill="${text}"/>
</svg>`
}

export const generateTitleBackgrounds = (config: SkinConfig) => {
    const { bg } = config.global.colors
    const radius = config.global.borderRadius
    const translucent = config.title.bgTranslucent || false

    return {
        center: generateBackgroundCenter(bg, 28, translucent),
        left: generateBackgroundLeft(bg, 28, radius, translucent),
        right: generateBackgroundRight(bg, 28, radius, translucent),
    }
}

export const generateTabsBackgrounds = (config: SkinConfig) => {
    const { bg } = config.global.colors
    const radius = config.global.borderRadius
    const translucent = config.tabs.bgTranslucent || false

    return {
        center: generateBackgroundCenter(bg, 28, translucent),
        left: generateBackgroundLeft(bg, 28, radius, translucent),
        right: generateBackgroundRight(bg, 28, radius, translucent),
    }
}

export const generateAllTitleButtons = (config: SkinConfig) => {
    const { buttonColors } = config.global
    const { config: configColors, focus, quit } = buttonColors

    return {
        config_up: generateButtonSvg('settings', configColors.upBg, configColors.upIcon, 20, 14),
        config_over: generateButtonSvg(
            'settings',
            configColors.overBg,
            configColors.overIcon,
            20,
            14
        ),
        config_down: generateButtonSvg(
            'settings',
            configColors.downBg,
            configColors.downIcon,
            20,
            14
        ),
        focus_up: generateButtonSvg('square', focus.upBg, focus.upIcon, 20, 14),
        focus_over: generateButtonSvg('square', focus.overBg, focus.overIcon, 20, 14),
        focus_down: generateButtonSvg('square', focus.downBg, focus.downIcon, 20, 14),
        quit_up: generateButtonSvg('x', quit.upBg, quit.upIcon, 20, 14),
        quit_over: generateButtonSvg('x', quit.overBg, quit.overIcon, 20, 14),
        quit_down: generateButtonSvg('x', quit.downBg, quit.downIcon, 20, 14),
    }
}

export const generateAllTabsButtons = (config: SkinConfig) => {
    const { buttonColors } = config.global
    const { plus, minus, close } = buttonColors

    return {
        plus_up: generatePlusMinusSvg('plus', plus.upBg, plus.upIcon, 16),
        plus_over: generatePlusMinusSvg('plus', plus.overBg, plus.overIcon, 16),
        plus_down: generatePlusMinusSvg('plus', plus.downBg, plus.downIcon, 16),
        minus_up: generatePlusMinusSvg('minus', minus.upBg, minus.upIcon, 16),
        minus_over: generatePlusMinusSvg('minus', minus.overBg, minus.overIcon, 16),
        minus_down: generatePlusMinusSvg('minus', minus.downBg, minus.downIcon, 16),
        close_up: generateCloseButtonSvg(close.upBg, close.upIcon, 16, 12),
        close_over: generateCloseButtonSvg(close.overBg, close.overIcon, 16, 12),
        close_down: generateCloseButtonSvg(close.downBg, close.downIcon, 16, 12),
    }
}

export const generateAllTabsAssets = (config: SkinConfig) => {
    const { selected, dim } = config.global.colors
    const radius = config.global.borderRadius
    const tabWidth = 8 // corner piece width

    return {
        tab_selected: generateTabSelected(config),
        tab_unselected: generateTabUnselected(config),
        selected_left: generateTabPiece(selected, tabWidth, 28, radius, true, false),
        selected_middle: generateTabPiece(selected, 104, 28, radius, false, true),
        selected_right: generateTabPiece(selected, tabWidth, 28, radius, false, false),
        unselected_left: generateTabPiece(dim, tabWidth, 28, radius, true, false),
        unselected_middle: generateTabPiece(dim, 104, 28, radius, false, true),
        unselected_right: generateTabPiece(dim, tabWidth, 28, radius, false, false),
        separator: generateSeparator(config.global.colors.text, 28),
        lock: generateLockSvg(config),
    }
}

export const generateAllAssets = (config: SkinConfig) => {
    const assets: Record<string, string> = {}

    assets['logo.svg'] = generateLogo(config)

    const titleBg = generateTitleBackgrounds(config)
    assets['title/background_center.svg'] = titleBg.center
    assets['title/background_left.svg'] = titleBg.left
    assets['title/background_right.svg'] = titleBg.right

    const titleBtns = generateAllTitleButtons(config)
    Object.entries(titleBtns).forEach(([key, value]) => {
        assets[`title/${key}.svg`] = value
    })

    const tabsBg = generateTabsBackgrounds(config)
    assets['tabs/background_center.svg'] = tabsBg.center
    assets['tabs/background_left.svg'] = tabsBg.left
    assets['tabs/background_right.svg'] = tabsBg.right

    const tabsBtns = generateAllTabsButtons(config)
    Object.entries(tabsBtns).forEach(([key, value]) => {
        assets[`tabs/${key}.svg`] = value
    })

    const tabsAssets = generateAllTabsAssets(config)
    Object.entries(tabsAssets).forEach(([key, value]) => {
        assets[`tabs/${key}.svg`] = value
    })

    return assets
}
