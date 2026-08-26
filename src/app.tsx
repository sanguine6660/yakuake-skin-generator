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
import type {
    IconRole,
    RgbColor,
    SkinConfig,
    IconLibrary,
    SavedSkin,
    ButtonColors,
    ButtonStateColors,
} from './types'
import { useSkinConfig } from './hooks/useSkinConfig'
import { useSkinExport } from './hooks/useSkinExport'
import { useSessionStorage } from './hooks/useSessionStorage'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useGoatCounter } from './hooks/useGoatCounter'
import { useGlobalStats } from './hooks/useGlobalStats'
import { MetaForm } from './components/forms/MetaForm'
import { GlobalForm } from './components/forms/GlobalForm'
import { TitleForm } from './components/forms/TitleForm'
import { TabsForm } from './components/forms/TabsForm'
import { Preview } from './components/preview/Preview'
import { ColorPreview } from './components/preview/ColorPreview'
import { StatsPreview } from './components/preview/StatsPreview'
import { TerminalForm } from './components/forms/TerminalForm'
import { Navbar } from './components/ui/Navbar'
import { Footer } from './components/ui/Footer'
import { PrivacyNotice } from './components/ui/PrivacyNotice'
import { TabPanel } from './components/ui/Tabs'
import { ExportForm } from './components/forms/ExportForm'
import { SkinSavesManager } from './components/forms/SkinSavesManager'
import { PRESETS, ICON_LIBRARIES, SKIN_ATTRIBUTION, createDefaultSkinConfig } from './constants'
import { decodeConfigHash } from './utils/configSerialization'
import {
    generateRandomSkin,
    pushRandomSkinEntry,
    type RandomSkinHistoryEntry,
} from './utils/randomSkinGenerator'
import { deriveColorscheme } from './utils/konsoleScheme'

export function App() {
    const defaultConfig = createDefaultSkinConfig()
    const [randomHistory, setRandomHistory] = useLocalStorage<RandomSkinHistoryEntry[]>(
        'yakuake-random-skin-history',
        []
    )

    const [savedConfig, setSavedConfig] = useSessionStorage<SkinConfig>(
        'yakuake-skin-config',
        defaultConfig
    )
    const {
        config,
        setConfig,
        canUndo,
        canRedo,
        undo,
        redo,
        updateMeta,
        updateGlobal,
        updateTitle,
        updateTabs,
        setIconLibrary,
        setIcon,
        updateTerminal,
        setAnsiSlot,
        setColor,
        setButtonColor,
        setRgbColor,
    } = useSkinConfig(savedConfig)

    const { downloadSkin, installToYakuake, installStatus, clearStatus } = useSkinExport()
    const { trackEvent } = useGoatCounter()
    const { stats: globalStats, incrementStat } = useGlobalStats()

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
    const [privacyAccepted, setPrivacyAccepted] = useLocalStorage<boolean>(
        'yakuake-privacy-accepted',
        false
    )
    const [loaderFinished, setLoaderFinished] = useState(false)
    const [privacyOpen, setPrivacyOpen] = useState(false)

    useEffect(() => {
        const handler = () => setLoaderFinished(true)
        window.addEventListener('loading-screen-finished', handler)
        return () => window.removeEventListener('loading-screen-finished', handler)
    }, [])

    useEffect(() => {
        if (loaderFinished && !privacyAccepted) setPrivacyOpen(true)
    }, [loaderFinished, privacyAccepted])

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
        const timer = setTimeout(() => {
            setSavedConfig(config)
        }, 300)
        return () => clearTimeout(timer)
    }, [config])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('yakuake-active-tab', activeTab)
        }
    }, [activeTab])

    // Count one anonymous app open per session load.
    useEffect(() => {
        incrementStat('app-opens')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Global undo/redo shortcuts. Skips form fields so text inputs keep their
    // native undo behavior.
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (!(event.ctrlKey || event.metaKey) || event.altKey) return
            const target = event.target as HTMLElement | null
            if (
                target &&
                (target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.tagName === 'SELECT' ||
                    target.isContentEditable)
            ) {
                return
            }
            const key = event.key.toLowerCase()
            if (key === 'z' && !event.shiftKey) {
                event.preventDefault()
                undo()
            } else if ((key === 'z' && event.shiftKey) || key === 'y') {
                event.preventDefault()
                redo()
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [undo, redo])

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
            incrementStat('downloads')
        }
    }

    const handleInstallToYakuake = async (config: SkinConfig) => {
        const success = await installToYakuake(config)
        if (success) {
            setExportCount((count) => count + 1)
            incrementStat('downloads')
        }
    }

    useEffect(() => {
        if (typeof window === 'undefined') return
        const imported = decodeConfigHash(window.location.hash)
        if (imported) {
            handleLoadSkin(imported)
            window.history.replaceState(null, '', window.location.pathname + window.location.search)
        }
    }, [])

    const handleTabChange = (tab: string) => {
        trackEvent(`tab:${tab}`)
        setActiveTab(tab)
    }

    const handleResetToDefault = () => {
        trackEvent('reset-default')
        setConfig(defaultConfig)
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('yakuake-active-tab', 'global')
        }
        setActiveTab('global')
    }

    const handleRandomizeSkin = () => {
        trackEvent('skin-randomized')
        const next = generateRandomSkin(config)
        incrementStat('random-skins')
        setConfig(next)
        setRandomHistory((history) =>
            pushRandomSkinEntry(history, {
                name: next.title.textContent,
                appliedAt: Date.now(),
                config: next,
            })
        )
    }

    const handleRestoreRandomSkin = (entry: RandomSkinHistoryEntry) => {
        trackEvent('skin-random-restored')
        // Pre-1.2 history entries carry no scheme - backfill one so the
        // preview and the enabled switch always have a defined state.
        setConfig({
            ...entry.config,
            terminal: entry.config.terminal ?? {
                ...deriveColorscheme(entry.config),
                enabled: true,
            },
        })
    }

    const handleClearRandomHistory = () => setRandomHistory([])

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
        setButtonColor(button as keyof ButtonColors, state as keyof ButtonStateColors, value)
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
                author: SKIN_ATTRIBUTION.author,
                email: SKIN_ATTRIBUTION.email,
                web: SKIN_ATTRIBUTION.web,
            })
            updateTerminal(
                deriveColorscheme({
                    ...config,
                    global: { ...config.global, ...(preset.config.global ?? {}) },
                    title: { ...config.title, ...(preset.config.title ?? {}) },
                    tabs: { ...config.tabs, ...(preset.config.tabs ?? {}) },
                    meta: { ...config.meta, skinName: preset.name },
                })
            )
            setPresetUsage((prev) => ({ ...prev, [preset.id]: (prev[preset.id] ?? 0) + 1 }))
            incrementStat('presets-applied')
            trackEvent(`preset:${preset.id}`, `${preset.name} (${preset.category})`)
        }
    }

    const handleSaveSkin = (name: string) => {
        trackEvent('skin-saved')
        incrementStat('skins-saved')
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
        setConfig({
            ...createDefaultSkinConfig(),
            ...savedConfigData,
            meta: { ...createDefaultSkinConfig().meta, ...savedConfigData.meta },
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
                    onRandomizeSkin={handleRandomizeSkin}
                    randomHistory={randomHistory}
                    onRestoreRandomSkin={handleRestoreRandomSkin}
                    onClearRandomHistory={handleClearRandomHistory}
                    onUndo={undo}
                    onRedo={redo}
                    canUndo={canUndo}
                    canRedo={canRedo}
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
                            <MetaForm
                                meta={config.meta}
                                onChange={(updates) => {
                                    updateMeta(updates)
                                    if (updates.skinName !== undefined) {
                                        updateTitle({ textContent: updates.skinName })
                                    }
                                }}
                            />
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
                                onImportConfig={handleLoadSkin}
                                onImportTracked={() => incrementStat('imports')}
                                installStatus={installStatus}
                                clearStatus={clearStatus}
                                savedSkins={savedSkins}
                            />
                        </TabPanel>

                        <TabPanel activeTab={activeTab} tabId="terminal">
                            <TerminalForm
                                config={config}
                                onUpdate={(updates) => updateTerminal(updates ?? {})}
                                onAnsiSlotChange={setAnsiSlot}
                                onDeriveFromPalette={() =>
                                    updateTerminal(deriveColorscheme(config))
                                }
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

                    <div className="mx-auto w-full space-y-6 lg:sticky lg:top-6 lg:mx-0 lg:w-105 lg:self-start">
                        <Preview config={config} />
                        <ColorPreview config={config} />
                        {privacyOpen && (
                            <PrivacyNotice
                                onAccept={() => {
                                    setPrivacyAccepted(true)
                                    setPrivacyOpen(false)
                                }}
                                onClose={() => setPrivacyOpen(false)}
                            />
                        )}

                        <StatsPreview
                            totalDownloads={globalStats.downloads}
                            globalStats={[
                                {
                                    value: globalStats['random-skins'],
                                    label: 'Random Skins Rolled',
                                },
                                { value: globalStats.imports, label: 'Skins Imported' },
                                {
                                    value: globalStats['presets-applied'],
                                    label: 'Presets Applied',
                                },
                                { value: globalStats['app-opens'], label: 'App Opens' },
                            ]}
                            exportCount={exportCount}
                            savedSkinsCount={savedSkinsCount}
                            favoritePreset={topPresetName}
                            favoritePresetCount={topPresetEntry?.[1] ?? 0}
                            favoriteIconLibrary={topLibraryName}
                            favoriteIconLibraryCount={topLibraryEntry?.[1] ?? 0}
                        />
                    </div>
                </div>

                <Footer onOpenPrivacy={() => setPrivacyOpen(true)} />
            </div>
        </div>
    )
}
