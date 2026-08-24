/**
 * @file src/components/forms/TabsForm.tsx
 * @description Form component for tabs bar configuration - layout, styling, buttons, separator
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

import type { SkinConfig, RgbColor } from '../../types'
import { ButtonConfigEditor, NumberInput, TextInput, RgbColorInput, Switch } from '../ui'

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

            <h3 className="mb-3 text-lg font-semibold text-gray-200">Tabs Bar Enabled</h3>
            <Switch
                label="Enable Tabs Bar"
                checked={tabs.tabsEnabled ?? true}
                onChange={(v) => onChange({ tabsEnabled: v })}
                config={config}
            />

            <h3 className="mb-3 text-lg font-semibold text-gray-200">Tab Styling (3-Piece)</h3>
            <h4 className="mb-2 text-sm text-gray-400">Selected Tab</h4>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
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
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
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
            <Switch
                label="Enable Translucent Background"
                checked={tabs.bgTranslucent ?? false}
                onChange={(v) => onChange({ bgTranslucent: v })}
                config={config}
            />

            <div className="space-y-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-200">Lock / Prevent Closing</h3>
                <ButtonConfigEditor
                    config={config.tabs.lockBtn}
                    label="Lock/Prevent Closing"
                    onChange={(updates) =>
                        onChange({ lockBtn: { ...config.tabs.lockBtn, ...updates } })
                    }
                    globalConfig={config}
                />

                <h3 className="mb-3 text-lg font-semibold text-gray-200">Plus/New Tab Button</h3>
                <ButtonConfigEditor
                    config={config.tabs.plusBtn}
                    label="Plus/New Tab"
                    onChange={(updates) =>
                        onChange({ plusBtn: { ...config.tabs.plusBtn, ...updates } })
                    }
                    globalConfig={config}
                />

                <h3 className="mb-3 text-lg font-semibold text-gray-200">Minus/Close Tab Button</h3>
                <ButtonConfigEditor
                    config={config.tabs.minusBtn}
                    label="Minus/Close Tab"
                    onChange={(updates) =>
                        onChange({ minusBtn: { ...config.tabs.minusBtn, ...updates } })
                    }
                    globalConfig={config}
                />

                <h3 className="mb-3 text-lg font-semibold text-gray-200">Close Button (Per-Tab)</h3>
                <ButtonConfigEditor
                    config={config.tabs.closeBtn}
                    label="Close Tab"
                    onChange={(updates) =>
                        onChange({ closeBtn: { ...config.tabs.closeBtn, ...updates } })
                    }
                    globalConfig={config}
                />
            </div>
        </div>
    )
}
