/**
 * @file src/utils/iconRenderer.tsx
 * @description Renders icons from react-icons libraries based on active icon library selection
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

import * as Lu from 'react-icons/lu'
import * as Fa from 'react-icons/fa'
import * as Fa6 from 'react-icons/fa6'
import * as Io from 'react-icons/io'
import * as Io5 from 'react-icons/io5'
import * as Md from 'react-icons/md'
import * as Ti from 'react-icons/ti'
import * as Go from 'react-icons/go'
import * as Fi from 'react-icons/fi'
import * as Gi from 'react-icons/gi'
import * as Wi from 'react-icons/wi'
import * as Di from 'react-icons/di'
import * as Ai from 'react-icons/ai'
import * as Bs from 'react-icons/bs'
import * as Ri from 'react-icons/ri'
import * as Fc from 'react-icons/fc'
import * as Gr from 'react-icons/gr'
import * as Hi from 'react-icons/hi'
import * as Hi2 from 'react-icons/hi2'
import * as Si from 'react-icons/si'
import * as Sl from 'react-icons/sl'
import * as Im from 'react-icons/im'
import * as Bi from 'react-icons/bi'
import * as Cg from 'react-icons/cg'
import * as Vsc from 'react-icons/vsc'
import * as Tb from 'react-icons/tb'
import * as Tfi from 'react-icons/tfi'
import * as Pi from 'react-icons/pi'

import type { SkinConfig, IconLibrary } from '../types'
import { createElement } from 'preact'
import { renderToString } from 'preact-render-to-string'

export const libraries: Record<IconLibrary, any> = {
    lucide: Lu,
    fa: Fa,
    fa6: Fa6,
    io: Io,
    io5: Io5,
    md: Md,
    ti: Ti,
    go: Go,
    fi: Fi,
    gi: Gi,
    wi: Wi,
    di: Di,
    ai: Ai,
    bs: Bs,
    ri: Ri,
    fc: Fc,
    gr: Gr,
    hi: Hi,
    hi2: Hi2,
    si: Si,
    sl: Sl,
    im: Im,
    bi: Bi,
    cg: Cg,
    vsc: Vsc,
    tb: Tb,
    tfi: Tfi,
    pi: Pi,
}

export const renderIcon = (config: SkinConfig, iconName: string, size = 16, color?: string) => {
    const lib = libraries[config.global.iconLibrary] || Lu
    const IconComponent = lib[iconName] || lib[Object.keys(lib)[0]]
    if (!IconComponent) return null
    return <IconComponent size={size} color={color || config.global.colors.text} />
}

const markupCache = new Map<string, string>()

export const getIconMarkup = (config: SkinConfig, iconName: string): string | null => {
    return markupCache.get(`${config.global.iconLibrary}:${iconName}`) ?? null
}

const buildIconMarkup = (config: SkinConfig, iconName: string): string | null => {
    const lib = libraries[config.global.iconLibrary]
    if (!lib) return null
    const IconComponent = lib[iconName]
    if (typeof IconComponent !== 'function') return null
    try {
        const markup = renderToString(createElement(IconComponent, { size: 24 }))
        const rootMatch = markup.match(/^<svg([^>]*)>([\s\S]*)<\/svg>$/)
        if (!rootMatch) return null
        const rootAttrs = rootMatch[1]
        let inner = rootMatch[2]
        const viewBoxMatch = rootAttrs.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)
        if (viewBoxMatch) {
            const w = parseFloat(viewBoxMatch[1])
            const h = parseFloat(viewBoxMatch[2])
            if (w > 0 && h > 0 && (Math.abs(w - 24) > 0.01 || Math.abs(h - 24) > 0.01)) {
                inner = `<g transform="scale(${(24 / w).toFixed(6)}, ${(24 / h).toFixed(6)})">${inner}</g>`
            }
        }
        const presentationAttrs = ['stroke', 'fill', 'stroke-width', 'stroke-linecap', 'stroke-linejoin']
            .map((name) => {
                const match = rootAttrs.match(new RegExp(`${name}="([^"]*)"`))
                return match ? `${name}="${match[1]}"` : ''
            })
            .filter(Boolean)
            .join(' ')
        return `<g ${presentationAttrs}>${inner}</g>`
    } catch {
        return null
    }
}

export const warmIconMarkupCache = (config: SkinConfig, iconName: string): boolean => {
    const key = `${config.global.iconLibrary}:${iconName}`
    if (markupCache.has(key)) return false
    const markup = buildIconMarkup(config, iconName)
    if (markup !== null) markupCache.set(key, markup)
    return markup !== null
}
