/**
 * @file src/components/forms/TitleForm.tsx
 * @description Form component for title bar configuration - border, text, background, buttons
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
import { NumberInput, TextInput, RgbColorInput, Switch, ButtonConfigEditor, Section } from '../ui'

interface TitleFormProps {
    config: SkinConfig
    onChange: (updates: Partial<SkinConfig['title']>) => void
    onRgbColorChange: (colorKey: string, rgb: RgbColor) => void
}

export const TitleForm = ({ config, onChange, onRgbColorChange }: TitleFormProps) => {
    const { title } = config

    return (
        <div className="space-y-6">
            <Section title="Title Bar" description="Enable or disable the bottom title bar">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Switch
                        label="Enable Title Bar"
                        checked={title.titleEnabled ?? true}
                        onChange={(v) => onChange({ titleEnabled: v })}
                        config={config}
                    />
                    <Switch
                        label="Translucent Background"
                        checked={title.bgTranslucent ?? false}
                        onChange={(v) => onChange({ bgTranslucent: v })}
                        config={config}
                    />
                </div>
            </Section>

            <Section title="Border">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <RgbColorInput
                        label="Border Color"
                        value={title.borderColor}
                        onChange={(v) => onRgbColorChange('borderColor', v)}
                    />
                    <NumberInput
                        label="Border Width"
                        value={title.borderWidth}
                        onChange={(v) => onChange({ borderWidth: v })}
                        min={0}
                        max={20}
                    />
                </div>
            </Section>

            <Section title="Title Text">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <NumberInput
                            label="X Position"
                            value={title.textX}
                            onChange={(v) => onChange({ textX: v })}
                            min={0}
                            max={200}
                        />
                        <NumberInput
                            label="Y Position"
                            value={title.textY}
                            onChange={(v) => onChange({ textY: v })}
                            min={0}
                            max={50}
                        />
                        <RgbColorInput
                            label="Text Color"
                            value={title.textColor}
                            onChange={(v) => onRgbColorChange('textColor', v)}
                        />
                        <TextInput
                            label="Text Content"
                            value={title.textContent}
                            onChange={(v) => onChange({ textContent: v })}
                        />
                    </div>
                    <Switch
                        label="Bold Text"
                        checked={title.textBold}
                        onChange={(v) => onChange({ textBold: v })}
                        config={config}
                    />
                </div>
            </Section>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                    Title Bar Buttons
                </h3>
                <ButtonConfigEditor
                    config={config.title.focusBtn}
                    label="Focus/Maximize"
                    onChange={(updates) =>
                        onChange({ focusBtn: { ...config.title.focusBtn, ...updates } })
                    }
                    globalConfig={config}
                />
                <ButtonConfigEditor
                    config={config.title.configBtn}
                    label="Config/Settings"
                    onChange={(updates) =>
                        onChange({ configBtn: { ...config.title.configBtn, ...updates } })
                    }
                    globalConfig={config}
                />
                <ButtonConfigEditor
                    config={config.title.quitBtn}
                    label="Quit/Close"
                    onChange={(updates) =>
                        onChange({ quitBtn: { ...config.title.quitBtn, ...updates } })
                    }
                    globalConfig={config}
                />
            </div>
        </div>
    )
}