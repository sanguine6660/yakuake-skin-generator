import { useState, useEffect } from 'preact/hooks'
import type { IconRole, RgbColor, SkinConfig, IconLibrary } from './types'
import { useSkinConfig } from './hooks/useSkinConfig'
import { useSkinExport } from './hooks/useSkinExport'
import { useSessionStorage } from './hooks/useSessionStorage'
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
    // Create default config for initial value
    const defaultConfig: SkinConfig = {
        meta: {
            skinName: 'My Custom Skin',
            author: 'Your Name',
            email: 'you@example.com',
            web: 'https://github.com/sanguine6660/yakuake-skin-generator',
            icon: '/logo.svg',
        },
        title: {
            borderColor: { r: 0, g: 0, b: 0 },
            borderWidth: 0,
            textX: 14,
            textY: 18,
            textColor: { r: 102, g: 194, b: 242 },
            textContent: 'My Custom Skin',
            textBold: true,
            bgCenter: '/title/background_center.svg',
            bgLeft: '/title/background_left.svg',
            bgRight: '/title/background_right.svg',
            bgTranslucent: false,
            titleEnabled: true,
            focusBtn: { enabled: true, x: 88, y: 4, up: '/title/focus_up.svg', over: '/title/focus_over.svg', down: '/title/focus_down.svg' },
            configBtn: { enabled: true, x: 58, y: 4, up: '/title/config_up.svg', over: '/title/config_over.svg', down: '/title/config_down.svg' },
            quitBtn: { enabled: true, x: 28, y: 4, up: '/title/quit_up.svg', over: '/title/quit_over.svg', down: '/title/quit_down.svg' },
        },
        tabs: {
            tabsX: 36,
            tabsY: 0,
            selectedColor: { r: 102, g: 194, b: 242 },
            unselectedColor: { r: 150, g: 150, b: 150 },
            separatorImage: '/tabs/tab_separator.svg',
            selectedLeft: '/tabs/tab_selected_left.svg',
            selectedMiddle: '/tabs/tab_selected_middle.svg',
            selectedRight: '/tabs/tab_selected_right.svg',
            unselectedLeft: '/tabs/tab_unselected_left.svg',
            unselectedMiddle: '/tabs/tab_unselected_middle.svg',
            unselectedRight: '/tabs/tab_unselected_right.svg',
            preventClosingImage: '/tabs/lock.svg',
            preventClosingX: 0,
            preventClosingY: 8,
            lockEnabled: true,
            bgCenter: '/tabs/background_center.svg',
            bgLeft: '/tabs/background_left.svg',
            bgRight: '/tabs/background_right.svg',
            bgTranslucent: false,
            tabsEnabled: true,
            plusBtn: { enabled: true, x: 2, y: 6, up: '/tabs/plus_up.svg', over: '/tabs/plus_over.svg', down: '/tabs/plus_down.svg' },
            minusBtn: { enabled: true, x: 22, y: 6, up: '/tabs/minus_up.svg', over: '/tabs/minus_over.svg', down: '/tabs/minus_down.svg' },
            closeBtn: { enabled: true, x: 5, y: 5, up: '/tabs/close_up.svg', over: '/tabs/close_over.svg', down: '/tabs/close_down.svg' },
            lockBtn: { enabled: true, x: 0, y: 8, up: '/tabs/lock.svg', over: '/tabs/lock.svg', down: '/tabs/lock.svg' },
        },
        global: {
            iconLibrary: 'lucide' as IconLibrary,
            iconSet: { settings: 'LuSettings', maximize: 'LuMaximize2', close: 'LuX', plus: 'LuPlus', minus: 'LuMinus', lock: 'LuLock' },
            colors: { bg: '#1e2233', selected: '#3b4252', text: '#66c2f2', dim: '#232834' },
            buttonColors: {
                focus: { upBg: '#232834', upIcon: '#66c2f2', overBg: '#3b4252', overIcon: '#66c2f2', downBg: '#66c2f2', downIcon: '#1e2233' },
                config: { upBg: '#232834', upIcon: '#66c2f2', overBg: '#3b4252', overIcon: '#66c2f2', downBg: '#66c2f2', downIcon: '#1e2233' },
                quit: { upBg: '#232834', upIcon: '#66c2f2', overBg: '#3b4252', overIcon: '#66c2f2', downBg: '#bf616a', downIcon: '#ffffff' },
                plus: { upBg: '#232834', upIcon: '#66c2f2', overBg: '#3b4252', overIcon: '#66c2f2', downBg: '#66c2f2', downIcon: '#1e2233' },
                minus: { upBg: '#232834', upIcon: '#66c2f2', overBg: '#3b4252', overIcon: '#66c2f2', downBg: '#66c2f2', downIcon: '#1e2233' },
                close: { upBg: '#232834', upIcon: '#66c2f2', overBg: '#3b4252', overIcon: '#66c2f2', downBg: '#66c2f2', downIcon: '#1e2233' },
            },
            borderRadius: 0,
            opacity: 100,
            translucency: false,
        },
    }

    const [savedConfig, setSavedConfig] = useSessionStorage<SkinConfig>('yakuake-skin-config', defaultConfig)
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

    const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
        const saved = sessionStorage.getItem('yakuake-active-tab')
        if (saved) return saved
    }
    return 'global'
})

    // Save config to sessionStorage whenever it changes
    useEffect(() => {
        setSavedConfig(config)
    }, [config])

    // Save activeTab to sessionStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('yakuake-active-tab', activeTab)
        }
    }, [activeTab])

    const handleResetToDefault = () => {
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
                <Navbar config={config} activeTab={activeTab} onTabChange={setActiveTab} onResetToDefault={handleResetToDefault} />

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
                    </div>
                </div>
            </div>
        </div>
    )
}