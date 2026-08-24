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
import { getIconPath, type IconName } from './iconPaths'
import { getIconMarkup } from './iconRenderer'
import { adjustHexBrightness } from './colors'

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
    const r = Math.min(radius, 8, height / 2)
    if (r <= 0) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="${height}"${opacity}><rect width="8" height="${height}" fill="${color}"/></svg>`
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="${height}"${opacity}><path d="M8,0 V${height} H${r} A${r},${r} 0 0,1 0,${height - r} V${r} A${r},${r} 0 0,1 ${r},0 Z" fill="${color}"/></svg>`
}

export const generateBackgroundRight = (
    color: string,
    height = 28,
    radius = 4,
    translucent = false
): string => {
    const opacity = translucent ? ' opacity="0.85"' : ''
    const r = Math.min(radius, 8, height / 2)
    if (r <= 0) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="${height}"${opacity}><rect width="8" height="${height}" fill="${color}"/></svg>`
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="${height}"${opacity}><path d="M0,0 H${8 - r} A${r},${r} 0 0,1 8,${r} V${height - r} A${r},${r} 0 0,1 ${8 - r},${height} H0 Z" fill="${color}"/></svg>`
}

export const generateButtonSvg = (
    iconMarkup: string | null,
    bgColor: string,
    iconColor: string,
    size = 20,
    iconSize = 14,
    isCircle = true,
    fallbackIcon: IconName = 'settings'
): string => {
    const iconPath = iconMarkup ?? getIconPath(fallbackIcon)
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
    const r = Math.min(radius, width, height / 2)
    if (r <= 0) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="${color}"/></svg>`
    }
    if (isLeft) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><path d="M${width},0 V${height} H${r} A${r},${r} 0 0,1 0,${height - r} V${r} A${r},${r} 0 0,1 ${r},0 Z" fill="${color}"/></svg>`
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><path d="M0,0 H${width - r} A${r},${r} 0 0,1 ${width},${r} V${height - r} A${r},${r} 0 0,1 ${width - r},${height} H0 Z" fill="${color}"/></svg>`
}

export const generateSeparator = (color: string, height = 28): string => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="${height}"><rect width="1" height="${height}" fill="${color}"/></svg>`
}

export const generateLockSvg = (config: SkinConfig): string => {
    const { text } = config.global.colors
    const iconContent = getIconMarkup(config, config.global.iconSet.lock) ?? getIconPath('lock')
    return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">${iconContent.replace(/currentColor/g, text)}</svg>`
}

export const generateCloseButtonSvg = (
    iconMarkup: string | null,
    bgColor: string,
    iconColor: string,
    size = 16,
    iconSize = 12
): string => {
    const iconPath = iconMarkup ?? getIconPath('x')
    const scale = iconSize / 24
    const translate = (size - 24 * scale) / 2
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="3" ry="3" fill="${bgColor}"/><g transform="translate(${translate}, ${translate}) scale(${scale})">${iconPath.replace(/currentColor/g, iconColor)}</g></svg>`
}

export const generatePlusMinusSvg = (
    iconMarkup: string | null,
    bgColor: string,
    iconColor: string,
    size = 16,
    fallbackIcon: IconName = 'plus'
): string => {
    const iconPath = iconMarkup ?? getIconPath(fallbackIcon)
    const scale = 0.5
    const translate = (size - 24 * scale) / 2
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="3" ry="3" fill="${bgColor}"/><g transform="translate(${translate}, ${translate}) scale(${scale})">${iconPath.replace(/currentColor/g, iconColor)}</g></svg>`
}

export const generateLogo = (config: SkinConfig): string => {
    const { bg, selected, text } = config.global.colors
    return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <defs>
    <linearGradient id="ylogo-bg" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
      <stop stop-color="${selected}"/>
      <stop offset="1" stop-color="${bg}"/>
    </linearGradient>
    <linearGradient id="ylogo-accent" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
      <stop stop-color="${adjustHexBrightness(text, 40)}"/>
      <stop offset="1" stop-color="${adjustHexBrightness(text, -30)}"/>
    </linearGradient>
  </defs>
  <rect width="48" height="48" rx="11" fill="url(#ylogo-bg)"/>
  <rect x="1.25" y="1.25" width="45.5" height="45.5" rx="9.75" stroke="url(#ylogo-accent)" stroke-width="2.5"/>
  <path d="M16 12 L24 18.5 L32 12" stroke="url(#ylogo-accent)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M13.5 26 L20 31.5 L13.5 37" stroke="${text}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M24.5 37 H35" stroke="${text}" stroke-width="3.5" stroke-linecap="round"/>
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
    const { buttonColors, iconSet } = config.global
    const { config: configColors, focus, quit } = buttonColors

    const configIcon = getIconMarkup(config, iconSet.settings)
    const focusIcon = getIconMarkup(config, iconSet.maximize)
    const quitIcon = getIconMarkup(config, iconSet.close)

    return {
        config_up: generateButtonSvg(
            configIcon,
            configColors.upBg,
            configColors.upIcon,
            20,
            14,
            true,
            'settings'
        ),
        config_over: generateButtonSvg(
            configIcon,
            configColors.overBg,
            configColors.overIcon,
            20,
            14,
            true,
            'settings'
        ),
        config_down: generateButtonSvg(
            configIcon,
            configColors.downBg,
            configColors.downIcon,
            20,
            14,
            true,
            'settings'
        ),
        focus_up: generateButtonSvg(focusIcon, focus.upBg, focus.upIcon, 20, 14, true, 'square'),
        focus_over: generateButtonSvg(
            focusIcon,
            focus.overBg,
            focus.overIcon,
            20,
            14,
            true,
            'square'
        ),
        focus_down: generateButtonSvg(
            focusIcon,
            focus.downBg,
            focus.downIcon,
            20,
            14,
            true,
            'square'
        ),
        quit_up: generateButtonSvg(quitIcon, quit.upBg, quit.upIcon, 20, 14, true, 'x'),
        quit_over: generateButtonSvg(quitIcon, quit.overBg, quit.overIcon, 20, 14, true, 'x'),
        quit_down: generateButtonSvg(quitIcon, quit.downBg, quit.downIcon, 20, 14, true, 'x'),
    }
}

export const generateAllTabsButtons = (config: SkinConfig) => {
    const { buttonColors, iconSet } = config.global
    const { plus, minus, close } = buttonColors

    const plusIcon = getIconMarkup(config, iconSet.plus)
    const minusIcon = getIconMarkup(config, iconSet.minus)
    const closeIcon = getIconMarkup(config, iconSet.close)

    return {
        plus_up: generatePlusMinusSvg(plusIcon, plus.upBg, plus.upIcon, 16, 'plus'),
        plus_over: generatePlusMinusSvg(plusIcon, plus.overBg, plus.overIcon, 16, 'plus'),
        plus_down: generatePlusMinusSvg(plusIcon, plus.downBg, plus.downIcon, 16, 'plus'),
        minus_up: generatePlusMinusSvg(minusIcon, minus.upBg, minus.upIcon, 16, 'minus'),
        minus_over: generatePlusMinusSvg(minusIcon, minus.overBg, minus.overIcon, 16, 'minus'),
        minus_down: generatePlusMinusSvg(minusIcon, minus.downBg, minus.downIcon, 16, 'minus'),
        close_up: generateCloseButtonSvg(closeIcon, close.upBg, close.upIcon, 16, 12),
        close_over: generateCloseButtonSvg(closeIcon, close.overBg, close.overIcon, 16, 12),
        close_down: generateCloseButtonSvg(closeIcon, close.downBg, close.downIcon, 16, 12),
    }
}

export const generateAllTabsAssets = (config: SkinConfig) => {
    const { selected, dim } = config.global.colors
    const radius = config.global.borderRadius
    const tabWidth = 8 // corner piece width

    return {
        tab_selected: generateTabSelected(config),
        tab_unselected: generateTabUnselected(config),
        tab_selected_left: generateTabPiece(selected, tabWidth, 28, radius, true, false),
        tab_selected_middle: generateTabPiece(selected, 104, 28, radius, false, true),
        tab_selected_right: generateTabPiece(selected, tabWidth, 28, radius, false, false),
        tab_unselected_left: generateTabPiece(dim, tabWidth, 28, radius, true, false),
        tab_unselected_middle: generateTabPiece(dim, 104, 28, radius, false, true),
        tab_unselected_right: generateTabPiece(dim, tabWidth, 28, radius, false, false),
        tab_separator: generateSeparator(config.global.colors.text, 28),
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
