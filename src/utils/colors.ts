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
