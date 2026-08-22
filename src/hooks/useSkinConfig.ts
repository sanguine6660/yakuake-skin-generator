import { useState, useCallback } from 'preact/hooks'
import type { SkinConfig, SkinMeta, IconLibrary, IconRole, RgbColor } from '../types'
import { createDefaultSkinConfig, DEFAULT_ICON_SETS } from '../constants'

const hexToRgb = (hex: string): RgbColor => {
    const cleanHex = hex.replace('#', '')
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0
    return { r, g, b }
}

export const useSkinConfig = () => {
    const [config, setConfig] = useState<SkinConfig>(createDefaultSkinConfig())

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
