/**
 * @file src/utils/iconRenderer.tsx
 * @description Lazy-loading icon library registry - loads icon library chunks on demand, renders live icons and generates static SVG markup for exports
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

import { useEffect, useState } from 'preact/hooks'
import type { SkinConfig, IconLibrary } from '../types'
import { renderToString } from 'preact-render-to-string'

type LibraryModule = Record<string, any>

const loaders: Record<IconLibrary, () => Promise<LibraryModule>> = {
    lucide: () => import('react-icons/lu'),
    fa: () => import('react-icons/fa'),
    fa6: () => import('react-icons/fa6'),
    io: () => import('react-icons/io'),
    io5: () => import('react-icons/io5'),
    md: () => import('react-icons/md'),
    ti: () => import('react-icons/ti'),
    go: () => import('react-icons/go'),
    fi: () => import('react-icons/fi'),
    gi: () => import('react-icons/gi'),
    wi: () => import('react-icons/wi'),
    di: () => import('react-icons/di'),
    ai: () => import('react-icons/ai'),
    bs: () => import('react-icons/bs'),
    ri: () => import('react-icons/ri'),
    fc: () => import('react-icons/fc'),
    gr: () => import('react-icons/gr'),
    hi: () => import('react-icons/hi'),
    hi2: () => import('react-icons/hi2'),
    si: () => import('react-icons/si'),
    sl: () => import('react-icons/sl'),
    im: () => import('react-icons/im'),
    bi: () => import('react-icons/bi'),
    cg: () => import('react-icons/cg'),
    vsc: () => import('react-icons/vsc'),
    tb: () => import('react-icons/tb'),
    tfi: () => import('react-icons/tfi'),
    pi: () => import('react-icons/pi'),
}

const loadedLibraries: Partial<Record<IconLibrary, LibraryModule>> = {}
const pendingLoads: Partial<Record<IconLibrary, Promise<LibraryModule>>> = {}

export const loadIconLibrary = (library: IconLibrary): Promise<LibraryModule> => {
    const cached = loadedLibraries[library]
    if (cached) return Promise.resolve(cached)
    const pending = pendingLoads[library]
    if (pending) return pending

    const load = loaders[library]()
        .then((lib) => {
            loadedLibraries[library] = lib
            delete pendingLoads[library]
            return lib
        })
        .catch((error) => {
            delete pendingLoads[library]
            console.error(`Failed to load icon library "${library}":`, error)
            return {}
        })
    pendingLoads[library] = load
    return load
}

export const useIconLibrary = (library: IconLibrary): LibraryModule | null => {
    const [lib, setLib] = useState<LibraryModule | null>(loadedLibraries[library] ?? null)

    useEffect(() => {
        let cancelled = false
        const current = loadedLibraries[library]
        if (current) {
            setLib(current)
            return
        }
        setLib(null)
        void loadIconLibrary(library).then((loaded) => {
            if (!cancelled) setLib(loaded ?? null)
        })
        return () => {
            cancelled = true
        }
    }, [library])

    return lib
}

export const renderIcon = (config: SkinConfig, iconName: string, size = 16, color?: string) => {
    const lib = loadedLibraries[config.global.iconLibrary]
    if (!lib) return null
    const IconComponent = lib[iconName] || lib[Object.keys(lib)[0]]
    if (!IconComponent) return null
    return <IconComponent size={size} color={color || config.global.colors.text} />
}

const markupCache = new Map<string, string>()

export const getIconMarkup = (config: SkinConfig, iconName: string): string | null => {
    return markupCache.get(`${config.global.iconLibrary}:${iconName}`) ?? null
}

const buildIconMarkup = (config: SkinConfig, iconName: string): string | null => {
    const lib = loadedLibraries[config.global.iconLibrary]
    if (!lib) return null
    const iconFactory = lib[iconName]
    if (typeof iconFactory !== 'function') return null
    try {
        const vnode: any = iconFactory({ size: 24 })
        const attr = vnode?.props?.attr ?? {}
        const children = vnode?.props?.children
        if (!children) return null

        let inner = renderToString(children as any)

        const viewBox = typeof attr.viewBox === 'string' ? attr.viewBox : undefined
        const viewBoxMatch = viewBox?.match(/0 0 ([\d.]+) ([\d.]+)/)
        if (viewBoxMatch) {
            const w = parseFloat(viewBoxMatch[1])
            const h = parseFloat(viewBoxMatch[2])
            if (w > 0 && h > 0 && (Math.abs(w - 24) > 0.01 || Math.abs(h - 24) > 0.01)) {
                inner = `<g transform="scale(${(24 / w).toFixed(6)}, ${(24 / h).toFixed(6)})">${inner}</g>`
            }
        }

        const rawAttr = attr as Record<string, string | number | undefined>
        const presentationAttrs = (
            [
                ['stroke', rawAttr.stroke ?? 'currentColor'],
                ['fill', rawAttr.fill ?? 'currentColor'],
                ['stroke-width', rawAttr.strokeWidth ?? '0'],
                ['stroke-linecap', rawAttr.strokeLinecap],
                ['stroke-linejoin', rawAttr.strokeLinejoin],
            ] as Array<[string, string | number | undefined]>
        )
            .filter(([, value]) => value !== undefined)
            .map(([name, value]) => `${name}="${value}"`)
            .join(' ')

        return `<g ${presentationAttrs}>${inner}</g>`
    } catch {
        return null
    }
}

export const warmIconMarkupCache = async (
    config: SkinConfig,
    iconName: string
): Promise<boolean> => {
    const key = `${config.global.iconLibrary}:${iconName}`
    if (markupCache.has(key)) return false
    await loadIconLibrary(config.global.iconLibrary)
    const markup = buildIconMarkup(config, iconName)
    if (markup !== null) markupCache.set(key, markup)
    return markup !== null
}

/**
 * Injects externally recovered icon markup (e.g. from an imported skin folder)
 * directly into the cache so previews and exports reuse it verbatim.
 */
export const primeIconMarkupCache = (library: string, iconName: string, markup: string): void => {
    markupCache.set(`${library}:${iconName}`, markup)
}
