/**
 * @file src/components/ui/ButtonConfigEditor.tsx
 * @description Compact collapsible editor card for button configuration - enabled toggle, position and optional custom image paths
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

import { useState } from 'preact/hooks'
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
}: ButtonConfigEditorProps) => {
    const [showImages, setShowImages] = useState(false)

    return (
        <div className="rounded-lg border border-[#1e293b] bg-[#090d16] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-sm font-medium text-white">{label}</h4>
                <div className="flex items-center gap-2">
                    <Switch
                        label="Enabled"
                        checked={config.enabled}
                        onChange={(v) => onChange({ enabled: v })}
                        config={globalConfig}
                    />
                    <button
                        type="button"
                        onClick={() => setShowImages((open) => !open)}
                        aria-expanded={showImages}
                        className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
                            showImages
                                ? 'border-[#66c2f2] text-[#66c2f2]'
                                : 'border-[#1e293b] text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        Images
                        <svg
                            width="10"
                            height="10"
                            viewBox="0 0 12 12"
                            fill="none"
                            className={`transition-transform ${showImages ? 'rotate-180' : ''}`}
                        >
                            <path
                                d="M3,4 L6,7 L9,4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div
                className={`mt-4 grid grid-cols-2 gap-4 ${
                    !config.enabled ? 'pointer-events-none opacity-50' : ''
                }`}
            >
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

            {showImages && (
                <div className="mt-4 space-y-3 border-t border-[#1e293b] pt-4">
                    <p className="text-[11px] text-gray-500">
                        Custom image paths — leave unchanged to use the generated assets.
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            )}
        </div>
    )
}