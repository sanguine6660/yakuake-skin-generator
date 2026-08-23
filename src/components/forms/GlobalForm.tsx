import { useState } from 'preact/hooks'
import type {
    SkinConfig,
    IconLibrary,
    IconRole,
    ButtonColors,
    ButtonStateColors,
} from '../../types'
import { ICON_LIBRARIES, ICON_ROLES, PRESETS, getPresetsByCategory } from '../../constants'
import { ColorInput, NumberInput, SelectInput, Switch } from '../ui'
import { IconPicker } from '../ui/IconPicker'
import { ButtonStateModal } from './ButtonStateModal'

interface GlobalFormProps {
    config: SkinConfig
    onIconLibraryChange: (lib: IconLibrary) => void
    onColorChange: (section: 'global' | 'title' | 'tabs', colorKey: string, value: string) => void
    onButtonColorChange: (
        button: keyof ButtonColors,
        state: keyof ButtonStateColors,
        value: string
    ) => void
    onBorderRadiusChange: (value: number) => void
    onOpacityChange: (value: number) => void
    onTranslucencyChange: (value: boolean) => void
    onIconChange: (role: IconRole, iconName: string) => void
    onApplyPreset: (presetId: string) => void
}

export const GlobalForm = ({
    config,
    onIconLibraryChange,
    onColorChange,
    onButtonColorChange,
    onBorderRadiusChange,
    onOpacityChange,
    onTranslucencyChange,
    onIconChange,
    onApplyPreset,
}: GlobalFormProps) => {
    const isPresetActive = (preset: (typeof PRESETS)[0]) => {
        return (
            config.global.colors.bg === preset.previewColors.bg &&
            config.global.colors.selected === preset.previewColors.selected &&
            config.global.colors.text === preset.previewColors.text &&
            config.global.colors.dim === preset.previewColors.dim &&
            config.global.borderRadius === preset.config.global?.borderRadius &&
            config.global.iconLibrary === preset.config.global?.iconLibrary
        )
    }

    const darkPresets = getPresetsByCategory('dark')
    const lightPresets = getPresetsByCategory('light')
    const [activePresetCategory, setActivePresetCategory] = useState<'dark' | 'light'>('dark')
    const [activeModal, setActiveModal] = useState<keyof ButtonColors | null>(null)

    const BUTTON_LABELS: Record<string, string> = {
        focus: 'Focus/Maximize',
        config: 'Config/Settings',
        quit: 'Quit/Close',
        plus: 'Plus/New Tab',
        minus: 'Minus/Close Tab',
        close: 'Close Tab (Per-Tab)',
    }

    return (
        <div className="space-y-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-200">Presets</h3>
            <div className="mb-3 flex gap-2" role="tablist">
                <button
                    type="button"
                    role="tab"
                    aria-selected={activePresetCategory === 'dark'}
                    onClick={() => setActivePresetCategory('dark')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                        activePresetCategory === 'dark'
                            ? 'border border-sky-400/50 bg-sky-400/10 text-sky-400'
                            : 'border border-[#1e293b] text-gray-400 hover:text-gray-200'
                    }`}
                >
                    Dark ({darkPresets.length})
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={activePresetCategory === 'light'}
                    onClick={() => setActivePresetCategory('light')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                        activePresetCategory === 'light'
                            ? 'border border-amber-400/50 bg-amber-400/10 text-amber-400'
                            : 'border border-[#1e293b] text-gray-400 hover:text-gray-200'
                    }`}
                >
                    Light ({lightPresets.length})
                </button>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                {(activePresetCategory === 'dark' ? darkPresets : lightPresets).map(
                    (preset: (typeof PRESETS)[0]) => {
                        const active = isPresetActive(preset)
                        const isLight = activePresetCategory === 'light'
                        const textColor = isLight ? 'text-gray-900' : 'text-white'
                        const descColor = isLight ? 'text-gray-600' : 'text-gray-400'
                        return (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => onApplyPreset(preset.id)}
                                className={`rounded-lg border p-3 text-left text-sm transition-all ${
                                    active
                                        ? 'border-sky-400 bg-sky-400/10 shadow-[0_0_0_1px_#66c2f2]'
                                        : 'border-[#1e293b] hover:border-sky-400/50'
                                }`}
                                style={{
                                    background: `linear-gradient(135deg, ${preset.previewColors.bg}, ${preset.previewColors.selected})`,
                                }}
                            >
                                <div className="mb-2 flex items-center gap-2">
                                    <div
                                        className="h-6 w-6 shrink-0 rounded"
                                        style={{ background: preset.previewColors.text }}
                                    />
                                    <span className={`truncate font-medium ${textColor}`}>
                                        {preset.name}
                                    </span>
                                    {active && (
                                        <span className="ml-auto text-xs text-sky-400">✓</span>
                                    )}
                                </div>
                                <p className={`truncate text-xs ${descColor}`}>
                                    {preset.description}
                                </p>
                            </button>
                        )
                    }
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <SelectInput
                    label="Icon Library"
                    value={config.global.iconLibrary}
                    onChange={(v) => onIconLibraryChange(v as IconLibrary)}
                    options={Object.entries(ICON_LIBRARIES).map(([value, label]) => ({
                        value,
                        label,
                    }))}
                />
                <NumberInput
                    label="Border Radius"
                    value={config.global.borderRadius}
                    onChange={onBorderRadiusChange}
                    min={0}
                    max={30}
                    showValue
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <NumberInput
                    label="Opacity"
                    value={config.global.opacity}
                    onChange={onOpacityChange}
                    min={0}
                    max={100}
                    step={5}
                    showValue
                />
                <Switch
                    label="Enable Translucency"
                    checked={config.global.translucency}
                    onChange={onTranslucencyChange}
                    config={config}
                />
            </div>

            <h3 className="mb-3 text-lg font-semibold text-gray-200">Color Palette</h3>
            <div className="grid grid-cols-2 gap-4">
                <ColorInput
                    label="Background"
                    value={config.global.colors.bg}
                    onChange={(v) => onColorChange('global', 'bg', v)}
                />
                <ColorInput
                    label="Selected/Accent"
                    value={config.global.colors.selected}
                    onChange={(v) => onColorChange('global', 'selected', v)}
                />
                <ColorInput
                    label="Text & Icons"
                    value={config.global.colors.text}
                    onChange={(v) => onColorChange('global', 'text', v)}
                />
                <ColorInput
                    label="Inactive/Dim"
                    value={config.global.colors.dim}
                    onChange={(v) => onColorChange('global', 'dim', v)}
                />
            </div>

            <h3 className="mb-3 text-lg font-semibold text-gray-200">Button State Colors</h3>
            <p className="mb-4 text-sm text-gray-400">
                Click a button to customize its up/over/down state colors.
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {(['focus', 'config', 'quit', 'plus', 'minus', 'close'] as const).map((btn) => (
                    <button
                        key={btn}
                        type="button"
                        onClick={() => setActiveModal(btn)}
                        className="rounded-lg border border-[#1e293b] bg-[#090d16] p-3 text-left transition-colors hover:border-sky-400/50"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-white capitalize">{btn}</span>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                className="text-gray-500"
                            >
                                <path
                                    d="M4 6L8 10L12 6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </button>
                ))}
            </div>

            <h3 className="mb-3 text-lg font-semibold text-gray-200">Icon Selection</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {ICON_ROLES.map(({ key, label }) => (
                    <IconPicker
                        key={key}
                        config={config}
                        role={key}
                        label={label}
                        onChange={(v) => onIconChange(key, v)}
                    />
                ))}
            </div>

            {activeModal && (
                <ButtonStateModal
                    isOpen={true}
                    onClose={() => setActiveModal(null)}
                    config={config}
                    button={activeModal}
                    buttonLabel={BUTTON_LABELS[activeModal] || activeModal}
                    onColorChange={onButtonColorChange}
                />
            )}
        </div>
    )
}
