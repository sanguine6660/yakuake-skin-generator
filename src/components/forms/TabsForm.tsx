import type { SkinConfig, RgbColor } from '../../types'
import { NumberInput, TextInput, RgbColorInput, CheckboxInput } from '../ui'

interface TabsFormProps {
    config: SkinConfig
    onChange: (updates: Partial<SkinConfig['tabs']>) => void
    onRgbColorChange: (colorKey: string, rgb: RgbColor) => void
}

export const TabsForm = ({ config, onChange, onRgbColorChange }: TabsFormProps) => {
    const { tabs } = config

    return (
        <div className="space-y-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-200">Tabs Layout</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <NumberInput
                    label="Tabs X"
                    value={tabs.tabsX}
                    onChange={(v) => onChange({ tabsX: v })}
                    min={0}
                    max={200}
                />
                <NumberInput
                    label="Tabs Y"
                    value={tabs.tabsY}
                    onChange={(v) => onChange({ tabsY: v })}
                    min={0}
                    max={50}
                />
                <RgbColorInput
                    label="Text Color"
                    value={tabs.tabsTextColor}
                    onChange={(v) => onRgbColorChange('tabsTextColor', v)}
                />
            </div>

            <h3 className="mb-3 text-lg font-semibold text-gray-200">Advanced Options</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextInput
                    label="Separator Image (optional)"
                    value={tabs.separatorImage ?? ''}
                    onChange={(v) => onChange({ separatorImage: v || undefined })}
                    placeholder="/tabs/tab_separator.svg"
                />
                <TextInput
                    label="Selected Left Corner (optional)"
                    value={tabs.selectedLeftCorner ?? ''}
                    onChange={(v) => onChange({ selectedLeftCorner: v || undefined })}
                    placeholder="/tabs/tab_selected_left.svg"
                />
                <TextInput
                    label="Selected Right Corner (optional)"
                    value={tabs.selectedRightCorner ?? ''}
                    onChange={(v) => onChange({ selectedRightCorner: v || undefined })}
                    placeholder="/tabs/tab_selected_right.svg"
                />
                <TextInput
                    label="Unselected Left Corner (optional)"
                    value={tabs.unselectedLeftCorner ?? ''}
                    onChange={(v) => onChange({ unselectedLeftCorner: v || undefined })}
                    placeholder="/tabs/tab_unselected_left.svg"
                />
                <TextInput
                    label="Unselected Right Corner (optional)"
                    value={tabs.unselectedRightCorner ?? ''}
                    onChange={(v) => onChange({ unselectedRightCorner: v || undefined })}
                    placeholder="/tabs/tab_unselected_right.svg"
                />
            </div>

            <h3 className="mb-3 text-lg font-semibold text-gray-200">Background Translucency</h3>
            <CheckboxInput
                label="Enable Translucent Background"
                checked={tabs.bgTranslucent ?? false}
                onChange={(v) => onChange({ bgTranslucent: v })}
            />

            <h3 className="mb-3 text-lg font-semibold text-gray-200">Lock Icon</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <CheckboxInput
                    label="Show Lock Icon"
                    checked={tabs.lockEnabled ?? true}
                    onChange={(v) => onChange({ lockEnabled: v })}
                />
                <NumberInput
                    label="Lock X"
                    value={tabs.lockX}
                    onChange={(v) => onChange({ lockX: v })}
                    min={-50}
                    max={50}
                />
                <NumberInput
                    label="Lock Y"
                    value={tabs.lockY}
                    onChange={(v) => onChange({ lockY: v })}
                    min={-50}
                    max={50}
                />
            </div>

            <h3 className="mb-3 text-lg font-semibold text-gray-200">Plus/Minus Buttons</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                    <CheckboxInput
                        label="Show Plus/New Tab Button"
                        checked={tabs.plusBtnEnabled ?? true}
                        onChange={(v) => onChange({ plusBtnEnabled: v })}
                    />
                    <NumberInput
                        label="Plus X"
                        value={tabs.plusBtnX}
                        onChange={(v) => onChange({ plusBtnX: v })}
                        min={0}
                        max={200}
                    />
                    <NumberInput
                        label="Plus Y"
                        value={tabs.plusBtnY}
                        onChange={(v) => onChange({ plusBtnY: v })}
                        min={0}
                        max={50}
                    />
                </div>
                <div className="space-y-2">
                    <CheckboxInput
                        label="Show Minus/Close Tab Button"
                        checked={tabs.minusBtnEnabled ?? true}
                        onChange={(v) => onChange({ minusBtnEnabled: v })}
                    />
                    <NumberInput
                        label="Minus X"
                        value={tabs.minusBtnX}
                        onChange={(v) => onChange({ minusBtnX: v })}
                        min={0}
                        max={200}
                    />
                    <NumberInput
                        label="Minus Y"
                        value={tabs.minusBtnY}
                        onChange={(v) => onChange({ minusBtnY: v })}
                        min={0}
                        max={50}
                    />
                </div>
            </div>
        </div>
    )
}
