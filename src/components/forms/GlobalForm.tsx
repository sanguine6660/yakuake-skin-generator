import { useState } from 'preact/hooks'
import type { SkinConfig, IconLibrary, IconRole } from '../../types'
import { ICON_LIBRARIES, ICON_ROLES, PRESETS, getPresetsByCategory } from '../../constants'
import { ColorInput, NumberInput, SelectInput, CheckboxInput, TextInput } from '../ui'
import { IconPicker } from '../ui/IconPicker'

interface GlobalFormProps {
    config: SkinConfig
    onIconLibraryChange: (lib: IconLibrary) => void
    onColorChange: (section: 'global' | 'title' | 'tabs', colorKey: string, value: string) => void
    onBorderRadiusChange: (value: number) => void
    onOpacityChange: (value: number) => void
    onTranslucencyChange: (value: boolean) => void
    onIconChange: (role: IconRole, iconName: string) => void
    onApplyPreset: (presetId: string) => void
    onChange: (updates: Partial<SkinConfig['meta']>) => void
}

export const GlobalForm = ({
    config,
    onIconLibraryChange,
    onColorChange,
    onBorderRadiusChange,
    onOpacityChange,
    onTranslucencyChange,
    onIconChange,
    onApplyPreset,
    onChange,
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

    return (
        <div className="space-y-6">
            {/* Presets */}
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
                                        className="h-6 w-6 flex-shrink-0 rounded"
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
                <CheckboxInput
                    label="Enable Translucency"
                    checked={config.global.translucency}
                    onChange={onTranslucencyChange}
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextInput
                    label="Website (optional)"
                    value={config.meta.web || ''}
                    onChange={(v) => onChange({ web: v })}
                    placeholder="https://github.com/yourname"
                />
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
        </div>
    )
}
