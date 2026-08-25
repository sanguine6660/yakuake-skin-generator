/**
 * @file src/components/forms/GlobalForm.tsx
 * @description Form component for global skin settings - presets, icon library, colors, button states, icons
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
import type {
    SkinConfig,
    IconLibrary,
    IconRole,
    ButtonColors,
    ButtonStateColors,
} from '../../types'
import { ICON_LIBRARIES, ICON_ROLES, PRESETS, getPresetsByCategory } from '../../constants'
import { deriveKonsoleBackground } from '../../utils/colors'
import { ColorInput, NumberInput, SelectInput, Switch, Section } from '../ui'
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

const PresetMiniTerminal = ({
    colors,
    name,
}: {
    colors: { bg: string; selected: string; text: string; dim: string }
    name: string
}) => (
    <div className="overflow-hidden rounded-md border border-black/50">
        <div className="flex h-4 items-center gap-1 px-1" style={{ background: colors.bg }}>
            <span className="h-1.5 w-1.5 rounded-[2px]" style={{ background: colors.text }} />
            <span
                className="rounded-[2px] px-1 text-[6px] leading-3"
                style={{ background: colors.selected, color: colors.text }}
            >
                tab
            </span>
            <span className="text-[6px] leading-3" style={{ color: colors.text }}>
                tab
            </span>
            <span className="text-[6px] leading-3" style={{ color: colors.text }}>
                tab
            </span>
        </div>
        <div className="h-5 px-1" style={{ background: colors.bg }}>
            <span className="text-[6px] leading-5" style={{ color: colors.text }}>
                ❯ _
            </span>
        </div>
        <div
            className="flex h-4 items-center justify-between gap-1 px-1"
            style={{ background: colors.bg }}
        >
            <span className="truncate text-[6px] leading-4" style={{ color: colors.text }}>
                {name}
            </span>
            <span className="flex shrink-0 gap-0.5">
                <span className="h-1 w-1 rounded-full" style={{ background: colors.text }} />
                <span className="h-1 w-1 rounded-full" style={{ background: colors.text }} />
                <span className="h-1 w-1 rounded-full" style={{ background: colors.text }} />
            </span>
        </div>
    </div>
)

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
    const [presetSearch, setPresetSearch] = useState('')
    const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null)
    const [presetPage, setPresetPage] = useState(0)

    const BUTTON_LABELS: Record<string, string> = {
        focus: 'Focus/Maximize',
        config: 'Config/Settings',
        quit: 'Quit/Close',
        plus: 'Plus/New Tab',
        minus: 'Minus/Close Tab',
        close: 'Close Tab (Per-Tab)',
    }

    const activePresets = activePresetCategory === 'dark' ? darkPresets : lightPresets
    const allTags = Array.from(new Set(activePresets.flatMap((preset) => preset.tags))).sort()

    const search = presetSearch.toLowerCase()
    const filteredPresets = activePresets.filter((preset) => {
        const matchesSearch =
            preset.name.toLowerCase().includes(search) ||
            preset.description.toLowerCase().includes(search) ||
            preset.tags.some((tag) => tag.toLowerCase().includes(search))
        const matchesTag = !activeTagFilter || preset.tags.includes(activeTagFilter)
        return matchesSearch && matchesTag
    })
    const presetPageSize = 8
    const presetTotalPages = Math.max(1, Math.ceil(filteredPresets.length / presetPageSize))
    const safePresetPage = Math.min(presetPage, presetTotalPages - 1)
    const pagePresets = filteredPresets.slice(
        safePresetPage * presetPageSize,
        safePresetPage * presetPageSize + presetPageSize
    )

    useEffect(() => {
        setPresetPage(0)
    }, [activePresetCategory, presetSearch, activeTagFilter])

    return (
        <div className="space-y-6">
            <Section
                title="Presets"
                description="One click applies a full theme — colors, title text and button states"
            >
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
                <input
                    type="text"
                    value={presetSearch}
                    onInput={(e) => setPresetSearch((e.target as HTMLInputElement).value)}
                    placeholder="Search presets…"
                    className="mb-3 w-full rounded-lg border border-[#1e293b] bg-[#090d16] px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-[#66c2f2] focus:outline-none"
                    aria-label="Search presets"
                />
                {allTags.length > 0 && (
                    <div className="mb-3 flex flex-wrap items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setActiveTagFilter(null)}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                                activeTagFilter === null
                                    ? 'bg-[#66c2f2] text-[#090d16]'
                                    : 'border border-[#1e293b] text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            All
                        </button>
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() =>
                                    setActiveTagFilter((current) => (current === tag ? null : tag))
                                }
                                className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                                    activeTagFilter === tag
                                        ? 'bg-[#66c2f2] text-[#090d16]'
                                        : 'border border-[#1e293b] text-gray-400 hover:text-gray-200'
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                    {pagePresets.map((preset: (typeof PRESETS)[0]) => {
                        const active = isPresetActive(preset)
                        const isLight = activePresetCategory === 'light'
                        return (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => onApplyPreset(preset.id)}
                                title={preset.description}
                                className={`rounded-lg border p-2 text-left transition-all ${
                                    active
                                        ? 'border-sky-400 bg-sky-400/10 shadow-[0_0_0_1px_#66c2f2]'
                                        : 'border-[#1e293b] hover:border-sky-400/50'
                                }`}
                            >
                                <PresetMiniTerminal
                                    colors={preset.previewColors}
                                    name={preset.name}
                                />
                                <div
                                    className="mt-2 rounded-md p-2"
                                    style={{
                                        background: `linear-gradient(135deg, ${preset.previewColors.bg}, ${preset.previewColors.selected})`,
                                    }}
                                >
                                    <div className="flex items-center justify-between gap-1">
                                        <span
                                            className={`truncate text-sm font-medium ${
                                                isLight ? 'text-gray-900' : 'text-white'
                                            }`}
                                        >
                                            {preset.name}
                                        </span>
                                        {active && (
                                            <span className="shrink-0 text-xs text-sky-300">✓</span>
                                        )}
                                    </div>
                                    <p
                                        className={`truncate text-[11px] ${
                                            isLight ? 'text-gray-700' : 'text-gray-300'
                                        }`}
                                    >
                                        {preset.description}
                                    </p>
                                </div>
                                <div className="mt-1.5 flex flex-wrap gap-1">
                                    {preset.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded bg-[#1e293b] px-1 py-0.5 text-[9px] text-gray-400"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </button>
                        )
                    })}
                </div>

                {filteredPresets.length === 0 && (
                    <p className="py-6 text-center text-sm text-gray-500">
                        No presets match "{presetSearch}"
                    </p>
                )}

                {presetTotalPages > 1 && (
                    <div className="flex items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => setPresetPage((page) => Math.max(0, page - 1))}
                            disabled={safePresetPage === 0}
                            className="rounded-lg border border-[#1e293b] px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-[#66c2f2] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Previous page"
                        >
                            ←
                        </button>
                        <span className="text-xs text-gray-400">
                            Page {safePresetPage + 1} of {presetTotalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                setPresetPage((page) => Math.min(presetTotalPages - 1, page + 1))
                            }
                            disabled={safePresetPage >= presetTotalPages - 1}
                            className="rounded-lg border border-[#1e293b] px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-[#66c2f2] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Next page"
                        >
                            →
                        </button>
                    </div>
                )}
            </Section>

            <Section title="Appearance">
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
            </Section>

            <Section title="Color Palette">
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
                    <ColorInput
                        label="Terminal Background"
                        value={
                            config.global.colors.konsoleBackground ??
                            deriveKonsoleBackground(config.global.colors.bg)
                        }
                        onChange={(v) => onColorChange('global', 'konsoleBackground', v)}
                        hint="preview only"
                    />
                </div>
            </Section>

            <Section
                title="Button State Colors"
                description="Click a button to customize its up/over/down state colors"
            >
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
            </Section>

            <Section
                title="Icon Selection"
                description="Pick the icon for each button role from the active library"
            >
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
            </Section>

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
