/**
 * @file src/utils/configSerialization.ts
 * @description JSON export/import and URL hash sharing for skin configurations
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
import { createDefaultSkinConfig } from '../constants'

const HASH_PREFIX = '#config='

export const exportConfigJson = (config: SkinConfig): string => JSON.stringify(config, null, 4)

export const parseConfigJson = (text: string): SkinConfig => {
    let parsed = JSON.parse(text) as Record<string, any>
    if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Not a skin configuration')
    }

    if (parsed.config?.data && typeof parsed.config.data === 'object') {
        const skin = parsed.skin ?? {}
        parsed = {
            meta: {
                skinName: skin.name,
                author: skin.author,
                email: skin.email,
                web: skin.web ?? skin.repository,
                icon: skin.icon,
            },
            ...parsed.config.data,
        }
    }

    if (
        typeof parsed.meta !== 'object' ||
        typeof parsed.title !== 'object' ||
        typeof parsed.tabs !== 'object' ||
        typeof parsed.global !== 'object'
    ) {
        throw new Error('Missing skin configuration sections')
    }

    // Drop explicitly-undefined values so they cannot shadow defaults.
    const compact = <T extends Record<string, unknown>>(obj: T): Partial<T> =>
        Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>

    const defaults = createDefaultSkinConfig()
    const importedButtonColors = parsed.global.buttonColors ?? {}
    const mergeButtonState = (key: string) => ({
        ...defaults.global.buttonColors[key as keyof typeof defaults.global.buttonColors],
        ...importedButtonColors[key],
    })

    return {
        meta: { ...defaults.meta, ...compact(parsed.meta) },
        title: { ...defaults.title, ...parsed.title },
        tabs: { ...defaults.tabs, ...parsed.tabs },
        global: {
            ...defaults.global,
            ...parsed.global,
            colors: { ...defaults.global.colors, ...parsed.global.colors },
            iconSet: { ...defaults.global.iconSet, ...parsed.global.iconSet },
            buttonColors: {
                focus: mergeButtonState('focus'),
                config: mergeButtonState('config'),
                quit: mergeButtonState('quit'),
                plus: mergeButtonState('plus'),
                minus: mergeButtonState('minus'),
                close: mergeButtonState('close'),
            },
        },
    }
}

export const encodeConfigHash = (config: SkinConfig): string =>
    HASH_PREFIX + btoa(encodeURIComponent(JSON.stringify(config)))

export const decodeConfigHash = (hash: string): SkinConfig | null => {
    if (!hash.startsWith(HASH_PREFIX)) return null
    try {
        return parseConfigJson(decodeURIComponent(atob(hash.slice(HASH_PREFIX.length))))
    } catch {
        return null
    }
}

export const downloadConfigJson = (config: SkinConfig): void => {
    const blob = new Blob([exportConfigJson(config)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${config.meta.skinName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
}
