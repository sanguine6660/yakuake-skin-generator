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
                    label="Selected Text Color"
                    value={tabs.selectedColor}
                    onChange={(v) => onRgbColorChange('selectedColor', v)}
                />
                <RgbColorInput
                    label="Unselected Text Color"
                    value={tabs.unselectedColor}
                    onChange={(v) => onRgbColorChange('unselectedColor', v)}
                />
            </div>

            <h3 className="mb-3 text-lg font-semibold text-gray-200">Tab Styling (3-Piece)</h3>
            <h4 className="mb-2 text-sm text-gray-400">Selected Tab</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-4">
                <TextInput
                    label="Selected Left"
                    value={tabs.selectedLeft}
                    onChange={(v) => onChange({ selectedLeft: v })}
                    placeholder="/tabs/tab_selected_left.svg"
                />
                <TextInput
                    label="Selected Middle"
                    value={tabs.selectedMiddle}
                    onChange={(v) => onChange({ selectedMiddle: v })}
                    placeholder="/tabs/tab_selected_middle.svg"
                />
                <TextInput
                    label="Selected Right"
                    value={tabs.selectedRight}
                    onChange={(v) => onChange({ selectedRight: v })}
                    placeholder="/tabs/tab_selected_right.svg"
                />
            </div>
            <h4 className="mb-2 text-sm text-gray-400">Unselected Tab</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-4">
                <TextInput
                    label="Unselected Left"
                    value={tabs.unselectedLeft}
                    onChange={(v) => onChange({ unselectedLeft: v })}
                    placeholder="/tabs/tab_unselected_left.svg"
                />
                <TextInput
                    label="Unselected Middle"
                    value={tabs.unselectedMiddle}
                    onChange={(v) => onChange({ unselectedMiddle: v })}
                    placeholder="/tabs/tab_unselected_middle.svg"
                />
                <TextInput
                    label="Unselected Right"
                    value={tabs.unselectedRight}
                    onChange={(v) => onChange({ unselectedRight: v })}
                    placeholder="/tabs/tab_unselected_right.svg"
                />
            </div>

            <h3 className="mb-3 text-lg font-semibold text-gray-200">Separator</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextInput
                    label="Separator Image (optional)"
                    value={tabs.separatorImage ?? ''}
                    onChange={(v) => onChange({ separatorImage: v || undefined })}
                    placeholder="/tabs/tab_separator.svg"
                />
            </div>

            <h3 className="mb-3 text-lg font-semibold text-gray-200">Background Translucency</h3>
            <CheckboxInput
                label="Enable Translucent Background"
                checked={tabs.bgTranslucent ?? false}
                onChange={(v) => onChange({ bgTranslucent: v })}
            />

            <h3 className="mb-3 text-lg font-semibold text-gray-200">Lock / Prevent Closing</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <CheckboxInput
                    label="Show Lock Icon"
                    checked={tabs.lockEnabled ?? true}
                    onChange={(v) => onChange({ lockEnabled: v })}
                />
                <TextInput
                    label="Lock Image"
                    value={tabs.preventClosingImage}
                    onChange={(v) => onChange({ preventClosingImage: v })}
                    placeholder="/tabs/lock.svg"
                />
                <NumberInput
                    label="Lock X"
                    value={tabs.preventClosingX}
                    onChange={(v) => onChange({ preventClosingX: v })}
                    min={-50}
                    max={50}
                />
                <NumberInput
                    label="Lock Y"
                    value={tabs.preventClosingY}
                    onChange={(v) => onChange({ preventClosingY: v })}
                    min={-50}
                    max={50}
                />
            </div>

            <h3 className="mb-3 text-lg font-semibold text-gray-200">Background Translucency</h3>
            <CheckboxInput
                label="Enable Translucent Background"
                checked={tabs.bgTranslucent ?? false}
                onChange={(v) => onChange({ bgTranslucent: v })}
            />

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

            <h3 className="mb-3 text-lg font-semibold text-gray-200">Close Button (Per-Tab)</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <CheckboxInput
                    label="Show Close Button"
                    checked={tabs.closeBtnEnabled ?? true}
                    onChange={(v) => onChange({ closeBtnEnabled: v })}
                />
                <TextInput
                    label="Close Image Up"
                    value={tabs.closeBtnUp}
                    onChange={(v) => onChange({ closeBtnUp: v })}
                    placeholder="/tabs/close_up.svg"
                />
                <TextInput
                    label="Close Image Over"
                    value={tabs.closeBtnOver}
                    onChange={(v) => onChange({ closeBtnOver: v })}
                    placeholder="/tabs/close_over.svg"
                />
                <TextInput
                    label="Close Image Down"
                    value={tabs.closeBtnDown}
                    onChange={(v) => onChange({ closeBtnDown: v })}
                    placeholder="/tabs/close_down.svg"
                />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <NumberInput
                    label="Close X"
                    value={tabs.closeBtnX}
                    onChange={(v) => onChange({ closeBtnX: v })}
                    min={-50}
                    max={200}
                />
                <NumberInput
                    label="Close Y"
                    value={tabs.closeBtnY}
                    onChange={(v) => onChange({ closeBtnY: v })}
                    min={-50}
                    max={50}
                />
            </div>
        </div>
    )
}