/**
 * @file src/hooks/useSkinConfig.ts
 * @description Custom hook for managing skin configuration state with granular update functions
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

import { useState, useCallback, useEffect } from 'preact/hooks'
import type { SkinConfig, SkinMeta, IconLibrary, IconRole, RgbColor } from '../types'
import { createDefaultSkinConfig, DEFAULT_ICON_SETS } from '../constants'

const hexToRgb = (hex: string): RgbColor => {
    const cleanHex = hex.replace('#', '')
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0
    return { r, g, b }
}

export const useSkinConfig = (initialConfig?: SkinConfig) => {
    const [config, setConfig] = useState<SkinConfig>(initialConfig ?? createDefaultSkinConfig())

    useEffect(() => {
        if (initialConfig) {
            setConfig(initialConfig)
        }
    }, [initialConfig])

    const updateMeta = useCallback((updates: Partial<SkinMeta>) => {
        setConfig((prev) => ({
            ...prev,
            meta: { ...prev.meta, ...updates },
        }))
    }, [])

    const updateGlobal = useCallback((updates: Partial<SkinConfig['global']>) => {
        setConfig((prev) => ({
            ...prev,
            global: { ...prev.global, ...updates },
        }))
    }, [])

    const updateTitle = useCallback((updates: Partial<SkinConfig['title']>) => {
        setConfig((prev) => ({
            ...prev,
            title: { ...prev.title, ...updates },
        }))
    }, [])

    const updateTabs = useCallback((updates: Partial<SkinConfig['tabs']>) => {
        setConfig((prev) => ({
            ...prev,
            tabs: { ...prev.tabs, ...updates },
        }))
    }, [])

    const setIconLibrary = useCallback((lib: IconLibrary) => {
        setConfig((prev) => ({
            ...prev,
            global: {
                ...prev.global,
                iconLibrary: lib,
                iconSet: DEFAULT_ICON_SETS[lib],
            },
        }))
    }, [])

    const setIcon = useCallback((role: IconRole, iconName: string) => {
        setConfig((prev) => ({
            ...prev,
            global: {
                ...prev.global,
                iconSet: { ...prev.global.iconSet, [role]: iconName },
            },
        }))
    }, [])

    const setColor = useCallback(
        (section: 'global' | 'title' | 'tabs', colorKey: string, value: string) => {
            setConfig((prev) => {
                if (section === 'global') {
                    return {
                        ...prev,
                        global: {
                            ...prev.global,
                            colors: { ...prev.global.colors, [colorKey]: value },
                        },
                    }
                }
                if (section === 'title') {
                    const rgb = hexToRgb(value)
                    return {
                        ...prev,
                        title: { ...prev.title, [colorKey]: rgb },
                    }
                }
                if (section === 'tabs') {
                    const rgb = hexToRgb(value)
                    return {
                        ...prev,
                        tabs: { ...prev.tabs, [colorKey]: rgb },
                    }
                }
                return prev
            })
        },
        []
    )

    const setRgbColor = useCallback(
        (section: 'title' | 'tabs', colorKey: string, rgb: RgbColor) => {
            setConfig((prev) => {
                if (section === 'title') {
                    return {
                        ...prev,
                        title: { ...prev.title, [colorKey]: rgb },
                    }
                }
                return {
                    ...prev,
                    tabs: { ...prev.tabs, [colorKey]: rgb },
                }
            })
        },
        []
    )

    return {
        config,
        setConfig,
        updateMeta,
        updateGlobal,
        updateTitle,
        updateTabs,
        setIconLibrary,
        setIcon,
        setColor,
        setRgbColor,
    }
}
