/**
 * @file src/utils/iconPaths.ts
 * @description Built-in SVG path definitions for common icons used in the skin generator
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

export const ICON_SVG_PATHS: Record<string, string> = {
    settings: `<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/>`,
    maximize: `<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>`,
    close: `<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M18 6 6 18M6 6l12 12"/>`,
    plus: `<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"/>`,
    minus: `<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"/>`,
    lock: `<rect width="18" height="11" x="3" y="11" fill="none" stroke="currentColor" stroke-width="2" rx="2" ry="2"/><path fill="none" stroke="currentColor" stroke-width="2" d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
    hamburger: `<rect x="4" y="6" width="16" height="2.4" rx="1.2" fill="currentColor"/><rect x="4" y="10.8" width="16" height="2.4" rx="1.2" fill="currentColor"/><rect x="4" y="15.6" width="16" height="2.4" rx="1.2" fill="currentColor"/>`,
    square: `<rect x="4.5" y="4.5" width="15" height="15" rx="2.5" fill="none" stroke="currentColor" stroke-width="2.5"/>`,
    x: `<path d="M6.5,6.5 L17.5,17.5 M17.5,6.5 L6.5,17.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`,
    lockSmall: `<rect x="3" y="9" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M8,9 V6.5 a4,4 0 0 1 8,0 V9" fill="none" stroke="currentColor" stroke-width="2.5"/>`,
}

export type IconName = keyof typeof ICON_SVG_PATHS

export const getIconSvg = (
    iconName: IconName,
    color: string,
    size = 24,
    viewBox = '0 0 24 24'
): string => {
    const path = ICON_SVG_PATHS[iconName] || ICON_SVG_PATHS.settings
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`
}

export const getIconPath = (iconName: IconName): string => {
    return ICON_SVG_PATHS[iconName] || ICON_SVG_PATHS.settings
}
