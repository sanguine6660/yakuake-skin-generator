/**
 * @file src/app.tsx
 * @description Main application component - orchestrates the skin generator UI with tabbed interface
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

import { useState, useEffect } from 'preact/compat'
import type { IconRole, RgbColor, SkinConfig, IconLibrary, SavedSkin } from './types'
import { useSkinConfig } from './hooks/useSkinConfig'
import { useSkinExport } from './hooks/useSkinExport'
import { useSessionStorage } from './hooks/useSessionStorage'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useGoatCounter } from './hooks/useGoatCounter'
import { useDownloadCounter } from './hooks/useDownloadCounter'
import { MetaForm } from './components/forms/MetaForm'
import { GlobalForm } from './components/forms/GlobalForm'
import { TitleForm } from './components/forms/TitleForm'
import { TabsForm } from './components/forms/TabsForm'
import { Preview } from './components/preview/Preview'
import { ColorPreview } from './components/preview/ColorPreview'
import { StatsPreview } from './components/preview/StatsPreview'
import { Navbar } from './components/ui/Navbar'
import { Footer } from './components/ui/Footer'
import { TabPanel } from './components/ui/Tabs'
import { ExportForm } from './components/forms/ExportForm'
import { SkinSavesManager } from './components/forms/SkinSavesManager'
import { PRESETS, ICON_LIBRARIES, createDefaultSkinConfig } from './constants'

export function App() {
    const defaultConfig = createDefaultSkinConfig()

    const [savedConfig, setSavedConfig] = useSessionStorage<SkinConfig>(
        'yakuake-skin-config',
        defaultConfig
    )
    const {
        config,
        updateMeta,
        updateGlobal,
        updateTitle,
        updateTabs,
        setIconLibrary,
        setIcon,
        setColor,
        setRgbColor,
    } = useSkinConfig(savedConfig)

    const { downloadSkin, installToYakuake, installStatus, clearStatus } = useSkinExport()
    const { trackEvent } = useGoatCounter()
    const { totalDownloads, incrementDownload } = useDownloadCounter()

    const [exportCount, setExportCount] = useLocalStorage<number>('yakuake-export-count', 0)
    const [savedSkins] = useLocalStorage<Record<string, SavedSkin>>('yakuake-skin-saves', {})
    const [presetUsage, setPresetUsage] = useLocalStorage<Record<string, number>>(
        'yakuake-preset-usage',
        {}
    )
    const [iconLibraryUsage, setIconLibraryUsage] = useLocalStorage<Record<string, number>>(
        'yakuake-icon-library-usage',
        {}
    )

    // State für Anzahl gespeicherter Skins (für StatsPreview)
    const [savedSkinsCount, setSavedSkinsCount] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('yakuake-skin-saves')
                return saved ? Object.keys(JSON.parse(saved)).length : 0
            } catch {
                return 0
            }
        }
        return 0
    })

    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('yakuake-active-tab')
            if (saved) return saved
        }
        return 'global'
    })

    useEffect(() => {
        setSavedConfig(config)
    }, [config])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('yakuake-active-tab', activeTab)
        }
    }, [activeTab])

    // Listener für localStorage-Änderungen, um den Saved-Skins-Zähler aktuell zu halten
    useEffect(() => {
        const updateSkinsCount = () => {
            try {
                const saved = localStorage.getItem('yakuake-skin-saves')
                if (saved) {
                    setSavedSkinsCount(Object.keys(JSON.parse(saved)).length)
                } else {
                    setSavedSkinsCount(0)
                }
            } catch {
                setSavedSkinsCount(0)
            }
        }

        window.addEventListener('storage', updateSkinsCount)
        window.addEventListener('local-storage', updateSkinsCount)
        return () => {
            window.removeEventListener('storage', updateSkinsCount)
            window.removeEventListener('local-storage', updateSkinsCount)
        }
    }, [])

    const handleDownloadSkin = async (config: SkinConfig) => {
        const success = await downloadSkin(config)
        if (success) {
            setExportCount((count) => count + 1)
            void incrementDownload()
        }
    }

    const handleInstallToYakuake = async (config: SkinConfig) => {
        const success = await installToYakuake(config)
        if (success) {
            setExportCount((count) => count + 1)
            void incrementDownload()
        }
    }

    const handleTabChange = (tab: string) => {
        trackEvent(`tab:${tab}`)
        setActiveTab(tab)
    }

    const handleResetToDefault = () => {
        trackEvent('reset-default')
        setSavedConfig(defaultConfig)
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('yakuake-active-tab', 'global')
        }
        setActiveTab('global')
    }

    const handleColorChange = (
        section: 'global' | 'title' | 'tabs',
        colorKey: string,
        value: string
    ) => {
        setColor(section, colorKey, value)
    }

    const handleTitleRgbColorChange = (colorKey: string, rgb: RgbColor) => {
        setRgbColor('title', colorKey, rgb)
    }

    const handleTabsRgbColorChange = (colorKey: string, rgb: RgbColor) => {
        setRgbColor('tabs', colorKey, rgb)
    }

    const handleIconLibraryChange = (lib: IconLibrary) => {
        setIconLibraryUsage((prev) => ({ ...prev, [lib]: (prev[lib] ?? 0) + 1 }))
        trackEvent(`icon-library:${lib}`)
        setIconLibrary(lib)
    }

    const handleIconChange = (role: IconRole, iconName: string) => {
        trackEvent(`icon-set:${role}:${iconName}`)
        setIcon(role, iconName)
    }

    const handleButtonColorChange = (button: string, state: string, value: string) => {
        const currentButtonColors = config.global.buttonColors
        const updatedButtonColors = {
            ...currentButtonColors,
            [button]: {
                ...currentButtonColors[button as keyof typeof currentButtonColors],
                [state]: value,
            },
        }
        updateGlobal({ buttonColors: updatedButtonColors as any })
    }

    const handleApplyPreset = (presetId: string) => {
        const preset = PRESETS.find((p) => p.id === presetId)
        if (preset) {
            Object.entries(preset.config.global || {}).forEach(([key, value]) => {
                if (key === 'iconSet' && typeof value === 'object') {
                    updateGlobal({ iconSet: value as any })
                } else if (key === 'colors' && typeof value === 'object') {
                    updateGlobal({ colors: { ...config.global.colors, ...(value as any) } })
                } else if (key === 'buttonColors' && typeof value === 'object') {
                    updateGlobal({ buttonColors: value as any })
                } else {
                    updateGlobal({ [key]: value } as any)
                }
            })
            Object.entries(preset.config.title || {}).forEach(([key, value]) => {
                updateTitle({ [key]: value } as any)
            })
            Object.entries(preset.config.tabs || {}).forEach(([key, value]) => {
                updateTabs({ [key]: value } as any)
            })
            updateMeta({
                skinName: preset.name,
                author: 'sanguine6660',
                email: 'sanguine6660@gmail.com',
                web: 'https://github.com/sanguine6660/yakuake-skin-generator',
            })
            setPresetUsage((prev) => ({ ...prev, [preset.id]: (prev[preset.id] ?? 0) + 1 }))
            trackEvent(`preset:${preset.id}`, `${preset.name} (${preset.category})`)
        }
    }

    const handleSaveSkin = (name: string) => {
        trackEvent('skin-saved')
        const saved = localStorage.getItem('yakuake-skin-saves')
        const saves = saved ? JSON.parse(saved) : {}
        const existing = saves[name]
        saves[name] = {
            name,
            config: { ...config },
            createdAt: existing?.createdAt ?? Date.now(),
            updatedAt: Date.now(),
        }
        localStorage.setItem('yakuake-skin-saves', JSON.stringify(saves))
        window.dispatchEvent(new Event('local-storage'))
    }

    const handleLoadSkin = (savedConfigData: SkinConfig) => {
        trackEvent('skin-loaded')
        Object.entries(savedConfigData.global || {}).forEach(([key, value]) => {
            if (key === 'iconSet' && typeof value === 'object') {
                updateGlobal({ iconSet: value as any })
            } else if (key === 'colors' && typeof value === 'object') {
                updateGlobal({ colors: { ...config.global.colors, ...(value as any) } })
            } else if (key === 'buttonColors' && typeof value === 'object') {
                updateGlobal({ buttonColors: value as any })
            } else {
                updateGlobal({ [key]: value } as any)
            }
        })
        Object.entries(savedConfigData.title || {}).forEach(([key, value]) => {
            updateTitle({ [key]: value } as any)
        })
        Object.entries(savedConfigData.tabs || {}).forEach(([key, value]) => {
            updateTabs({ [key]: value } as any)
        })
        updateMeta({
            skinName: savedConfigData.meta.skinName,
            author: 'sanguine6660',
            email: 'sanguine6660@gmail.com',
            web: 'https://github.com/sanguine6660/yakuake-skin-generator',
        })
    }

    const handleDeleteSkin = (name: string) => {
        trackEvent('skin-deleted')
        const saved = localStorage.getItem('yakuake-skin-saves')
        if (saved) {
            const saves = JSON.parse(saved)
            delete saves[name]
            localStorage.setItem('yakuake-skin-saves', JSON.stringify(saves))
            window.dispatchEvent(new Event('local-storage'))
        }
    }

    const handleRenameSkin = (oldName: string, newName: string) => {
        trackEvent('skin-renamed')
        const saved = localStorage.getItem('yakuake-skin-saves')
        if (saved) {
            const saves = JSON.parse(saved)
            if (saves[oldName]) {
                saves[newName] = { ...saves[oldName], name: newName, updatedAt: Date.now() }
                delete saves[oldName]
                localStorage.setItem('yakuake-skin-saves', JSON.stringify(saves))
                window.dispatchEvent(new Event('local-storage'))
            }
        }
    }

    const topPresetEntry = Object.entries(presetUsage).sort((a, b) => b[1] - a[1])[0]
    const topPresetName = topPresetEntry
        ? PRESETS.find((preset) => preset.id === topPresetEntry[0])?.name
        : undefined
    const topLibraryEntry = Object.entries(iconLibraryUsage).sort((a, b) => b[1] - a[1])[0]
    const topLibraryName = topLibraryEntry
        ? ICON_LIBRARIES[topLibraryEntry[0] as IconLibrary]
        : undefined

    return (
        <div className="min-h-screen bg-[#090d16] font-sans text-white">
            <div className="w-full px-4 py-8 md:px-6 lg:px-8">
                <Navbar
                    config={config}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    onResetToDefault={handleResetToDefault}
                />

                {installStatus && (
                    <div
                        className="mb-6 w-full rounded-lg border p-4 transition-all"
                        style={{
                            backgroundColor:
                                installStatus.type === 'error'
                                    ? '#3d1a1a'
                                    : installStatus.type === 'success'
                                      ? '#1a3d1a'
                                      : '#1a2d3d',
                            borderColor:
                                installStatus.type === 'error'
                                    ? '#bf616a'
                                    : installStatus.type === 'success'
                                      ? '#a3be8c'
                                      : '#66c2f2',
                            color:
                                installStatus.type === 'error'
                                    ? '#ff6b6b'
                                    : installStatus.type === 'success'
                                      ? '#a3be8c'
                                      : '#66c2f2',
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm">{installStatus.message}</p>
                            <button
                                onClick={clearStatus}
                                className="text-lg leading-none text-gray-400 hover:text-white"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
                    <div className="w-full space-y-6">
                        <TabPanel activeTab={activeTab} tabId="meta">
                            <MetaForm meta={config.meta} onChange={updateMeta} />
                        </TabPanel>

                        <TabPanel activeTab={activeTab} tabId="global">
                            <GlobalForm
                                config={config}
                                onIconLibraryChange={handleIconLibraryChange}
                                onColorChange={handleColorChange}
                                onButtonColorChange={handleButtonColorChange}
                                onBorderRadiusChange={(v) => updateGlobal({ borderRadius: v })}
                                onOpacityChange={(v) => updateGlobal({ opacity: v })}
                                onTranslucencyChange={(v) => updateGlobal({ translucency: v })}
                                onIconChange={handleIconChange}
                                onApplyPreset={handleApplyPreset}
                            />
                        </TabPanel>

                        <TabPanel activeTab={activeTab} tabId="title">
                            <TitleForm
                                config={config}
                                onChange={updateTitle}
                                onRgbColorChange={handleTitleRgbColorChange}
                            />
                        </TabPanel>

                        <TabPanel activeTab={activeTab} tabId="tabs">
                            <TabsForm
                                config={config}
                                onChange={updateTabs}
                                onRgbColorChange={handleTabsRgbColorChange}
                            />
                        </TabPanel>

                        <TabPanel activeTab={activeTab} tabId="export">
                            <ExportForm
                                config={config}
                                downloadSkin={handleDownloadSkin}
                                installToYakuake={handleInstallToYakuake}
                                installStatus={installStatus}
                                clearStatus={clearStatus}
                                savedSkins={savedSkins}
                            />
                        </TabPanel>

                        <TabPanel activeTab={activeTab} tabId="skins">
                            <SkinSavesManager
                                currentSkinName={config.meta.skinName}
                                onSave={handleSaveSkin}
                                onLoad={handleLoadSkin}
                                onDelete={handleDeleteSkin}
                                onRename={handleRenameSkin}
                            />
                        </TabPanel>
                    </div>

                    <div className="mx-auto w-full space-y-6 lg:mx-0 lg:w-[420px]">
                        <Preview config={config} />
                        <ColorPreview config={config} />
                        <StatsPreview
                            totalDownloads={totalDownloads}
                            exportCount={exportCount}
                            savedSkinsCount={savedSkinsCount}
                            favoritePreset={topPresetName}
                            favoritePresetCount={topPresetEntry?.[1] ?? 0}
                            favoriteIconLibrary={topLibraryName}
                            favoriteIconLibraryCount={topLibraryEntry?.[1] ?? 0}
                        />
                    </div>
                </div>

                <Footer config={config} />
            </div>
        </div>
    )
}
