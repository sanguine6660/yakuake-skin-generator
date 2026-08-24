/**
 * @file src/components/ui/ButtonConfigEditor.tsx
 * @description Editor component for button configuration - enabled state, position, and image paths
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

import type { SkinConfig, ButtonConfig } from '../../types'
import { NumberInput, TextInput, Switch } from '../ui'

interface ButtonConfigEditorProps {
    config: ButtonConfig
    label: string
    onChange: (updates: Partial<ButtonConfig>) => void
    globalConfig: SkinConfig
}

export const ButtonConfigEditor = ({
    config,
    label,
    onChange,
    globalConfig,
}: ButtonConfigEditorProps) => (
    <div className="rounded-lg border border-[#1e293b] bg-[#090d16] p-4">
        <div className="mb-3 flex items-center justify-between">
            <h4 className="font-medium text-white capitalize">{label} Button</h4>
            <Switch
                label="Enabled"
                checked={config.enabled}
                onChange={(v) => onChange({ enabled: v })}
                config={globalConfig}
            />
        </div>

        <div
            className={`grid grid-cols-1 gap-4 md:grid-cols-3 ${!config.enabled ? 'pointer-events-none opacity-50' : ''}`}
        >
            <div className="space-y-3 md:col-span-2">
                <div className="grid grid-cols-2 gap-4">
                    <TextInput
                        label="Up Image"
                        value={config.up}
                        onChange={(v) => onChange({ up: v })}
                        placeholder="up_image.svg"
                    />
                    <TextInput
                        label="Over Image"
                        value={config.over}
                        onChange={(v) => onChange({ over: v })}
                        placeholder="over_image.svg"
                    />
                </div>
                <TextInput
                    label="Down Image"
                    value={config.down}
                    onChange={(v) => onChange({ down: v })}
                    placeholder="down_image.svg"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <NumberInput
                    label="X Position"
                    value={config.x}
                    onChange={(v) => onChange({ x: v })}
                    min={0}
                    max={200}
                />
                <NumberInput
                    label="Y Position"
                    value={config.y}
                    onChange={(v) => onChange({ y: v })}
                    min={0}
                    max={50}
                />
            </div>
        </div>
    </div>
)
