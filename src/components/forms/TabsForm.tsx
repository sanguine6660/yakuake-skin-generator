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
import { ButtonConfigEditor, NumberInput, TextInput, RgbColorInput, Switch, Section } from '../ui'

interface TabsFormProps {
    config: SkinConfig
    onChange: (updates: Partial<SkinConfig['tabs']>) => void
    onRgbColorChange: (colorKey: string, rgb: RgbColor) => void
}

export const TabsForm = ({ config, onChange, onRgbColorChange }: TabsFormProps) => {
    const { tabs } = config

    return (
        <div className="space-y-6">
            <Section title="Tabs Bar" description="Enable or disable the top tabs bar">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Switch
                        label="Enable Tabs Bar"
                        checked={tabs.tabsEnabled ?? true}
                        onChange={(v) => onChange({ tabsEnabled: v })}
                        config={config}
                    />
                    <Switch
                        label="Translucent Background"
                        checked={tabs.bgTranslucent ?? false}
                        onChange={(v) => onChange({ bgTranslucent: v })}
                        config={config}
                    />
                </div>
            </Section>

            <Section title="Tabs Layout">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                </div>
            </Section>

            <Section
                title="Tab Styling"
                description="Three-piece tab images — leave unchanged to use the generated assets"
            >
                <div className="space-y-4">
                    <div>
                        <p className="mb-2 text-xs font-medium text-gray-400">Selected Tab</p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <TextInput
                                label="Left"
                                value={tabs.selectedLeft}
                                onChange={(v) => onChange({ selectedLeft: v })}
                                placeholder="selected_left.svg"
                            />
                            <TextInput
                                label="Middle"
                                value={tabs.selectedMiddle}
                                onChange={(v) => onChange({ selectedMiddle: v })}
                                placeholder="selected_middle.svg"
                            />
                            <TextInput
                                label="Right"
                                value={tabs.selectedRight}
                                onChange={(v) => onChange({ selectedRight: v })}
                                placeholder="selected_right.svg"
                            />
                        </div>
                    </div>
                    <div>
                        <p className="mb-2 text-xs font-medium text-gray-400">Unselected Tab</p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <TextInput
                                label="Left"
                                value={tabs.unselectedLeft}
                                onChange={(v) => onChange({ unselectedLeft: v })}
                                placeholder="unselected_left.svg"
                            />
                            <TextInput
                                label="Middle"
                                value={tabs.unselectedMiddle}
                                onChange={(v) => onChange({ unselectedMiddle: v })}
                                placeholder="unselected_middle.svg"
                            />
                            <TextInput
                                label="Right"
                                value={tabs.unselectedRight}
                                onChange={(v) => onChange({ unselectedRight: v })}
                                placeholder="unselected_right.svg"
                            />
                        </div>
                    </div>
                    <TextInput
                        label="Separator Image (optional)"
                        value={tabs.separatorImage ?? ''}
                        onChange={(v) => onChange({ separatorImage: v || undefined })}
                        placeholder="tab_separator.svg"
                    />
                </div>
            </Section>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
                    Tab Bar Buttons
                </h3>
                <ButtonConfigEditor
                    config={config.tabs.lockBtn}
                    label="Lock/Prevent Closing"
                    onChange={(updates) =>
                        onChange({ lockBtn: { ...config.tabs.lockBtn, ...updates } })
                    }
                    globalConfig={config}
                />
                <ButtonConfigEditor
                    config={config.tabs.plusBtn}
                    label="Plus/New Tab"
                    onChange={(updates) =>
                        onChange({ plusBtn: { ...config.tabs.plusBtn, ...updates } })
                    }
                    globalConfig={config}
                />
                <ButtonConfigEditor
                    config={config.tabs.minusBtn}
                    label="Minus/Close Tab"
                    onChange={(updates) =>
                        onChange({ minusBtn: { ...config.tabs.minusBtn, ...updates } })
                    }
                    globalConfig={config}
                />
                <ButtonConfigEditor
                    config={config.tabs.closeBtn}
                    label="Close Tab (Per-Tab)"
                    onChange={(updates) =>
                        onChange({ closeBtn: { ...config.tabs.closeBtn, ...updates } })
                    }
                    globalConfig={config}
                />
            </div>
        </div>
    )
}
