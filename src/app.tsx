import { useState } from 'preact/hooks'
import type { IconRole, RgbColor } from './types'
import { useSkinConfig } from './hooks/useSkinConfig'
import { useSkinExport } from './hooks/useSkinExport'
import { MetaForm } from './components/forms/MetaForm'
import { GlobalForm } from './components/forms/GlobalForm'
import { TitleForm } from './components/forms/TitleForm'
import { TabsForm } from './components/forms/TabsForm'
import { Preview } from './components/preview/Preview'
import { ColorPreview } from './components/preview/ColorPreview'
import { Navbar } from './components/ui/Navbar'
import { TabPanel } from './components/ui/Tabs'
import { ExportForm } from './components/forms/ExportForm'
import { PRESETS } from './constants'

export function App() {
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
    } = useSkinConfig()

    const { downloadSkin, installToYakuake, installStatus, clearStatus } = useSkinExport()

    const [activeTab, setActiveTab] = useState('global')

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

    const handleIconChange = (role: IconRole, iconName: string) => {
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
            // We need to update the config - but useSkinConfig doesn't have a replace method
            // We'll use setConfig through the hook... but it's not exposed.
            // For now, we'll apply each part manually
            Object.entries(preset.config.global || {}).forEach(([key, value]) => {
                if (key === 'iconSet' && typeof value === 'object') {
                    updateGlobal({ iconSet: value as any })
                } else if (key === 'colors' && typeof value === 'object') {
                    updateGlobal({ colors: { ...config.global.colors, ...(value as any) } })
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
            // Update meta
            updateMeta({
                skinName: preset.name,
                author: 'sanguine6660',
                email: 'sanguine6660@gmail.com',
                web: 'https://github.com/sanguine6660/yakuake-skin-generator',
            })
        }
    }

    return (
        <div className="min-h-screen bg-[#090d16] font-sans text-white">
            <div className="w-full px-4 py-8 md:px-6 lg:px-8">
                <Navbar config={config} activeTab={activeTab} onTabChange={setActiveTab} />

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
                    {/* Left Column: Controls */}
                    <div className="w-full space-y-6">
                        <TabPanel activeTab={activeTab} tabId="meta">
                            <MetaForm meta={config.meta} onChange={updateMeta} />
                        </TabPanel>

                        <TabPanel activeTab={activeTab} tabId="global">
                            <GlobalForm
                                config={config}
                                onIconLibraryChange={setIconLibrary}
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
                                downloadSkin={downloadSkin}
                                installToYakuake={installToYakuake}
                                installStatus={installStatus}
                                clearStatus={clearStatus}
                            />
                        </TabPanel>
                    </div>

                    {/* Right Column: Live Preview - fixed width but responsive */}
                    <div className="mx-auto w-full space-y-6 lg:mx-0 lg:w-[420px]">
                        <Preview config={config} />
                        <ColorPreview config={config} />

                        {/* Installation Guide */}
                        <div className="w-full rounded-xl border border-[#1e293b] bg-[#121824] p-6 shadow-xl">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-200">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    style={{ color: config.global.colors.text }}
                                >
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="9"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M10 6v8M6 10h8"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                How to Install
                            </h3>
                            <div className="space-y-3 text-sm text-gray-300">
                                <div className="flex items-start gap-3">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-700 font-mono text-xs text-white">
                                        1
                                    </span>
                                    <div>
                                        <p className="font-medium text-white">
                                            Auto-Install (Recommended)
                                        </p>
                                        <p>
                                            Click "Install to Yakuake" → select{' '}
                                            <code className="rounded bg-gray-700 px-1 text-xs">
                                                ~/.local/share/yakuake/skins/
                                            </code>{' '}
                                            → done!
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-700 font-mono text-xs text-white">
                                        2
                                    </span>
                                    <div>
                                        <p className="font-medium text-white">Manual Install</p>
                                        <p>
                                            Click "Download .tar.gz" → extract to{' '}
                                            <code className="rounded bg-gray-700 px-1 text-xs">
                                                ~/.local/share/yakuake/skins/
                                            </code>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-700 font-mono text-xs text-white">
                                        3
                                    </span>
                                    <div>
                                        <p className="font-medium text-white">Apply in Yakuake</p>
                                        <p>
                                            Open Yakuake → Right-click title bar → Configure →
                                            Appearance → Select your skin → Apply
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-700 font-mono text-xs text-white">
                                        4
                                    </span>
                                    <div>
                                        <p className="font-medium text-white">Restart if needed</p>
                                        <p>
                                            Run{' '}
                                            <code className="rounded bg-gray-700 px-1 text-xs">
                                                killall yakuake && yakuake
                                            </code>{' '}
                                            if skin doesn't appear immediately
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
