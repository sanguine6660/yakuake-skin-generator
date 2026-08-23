/**
 * @file src/components/forms/ButtonStateModal.tsx
 * @description Modal component for editing button state colors (up/over/down) for each button type
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

import type { SkinConfig, ButtonColors, ButtonStateColors } from '../../types'
import { ColorInput, Switch } from '../ui'
import { Modal } from '../ui/Modal'

interface ButtonStateModalProps {
    isOpen: boolean
    onClose: () => void
    config: SkinConfig
    button: keyof ButtonColors
    buttonLabel: string
    onColorChange: (
        button: keyof ButtonColors,
        state: keyof ButtonStateColors,
        value: string
    ) => void
}

const STATES = [
    { key: 'up' as const, label: 'Normal (Up)', bgKey: 'upBg', iconKey: 'upIcon' },
    { key: 'over' as const, label: 'Hover (Over)', bgKey: 'overBg', iconKey: 'overIcon' },
    { key: 'down' as const, label: 'Pressed (Down)', bgKey: 'downBg', iconKey: 'downIcon' },
] as const

export const ButtonStateModal = ({
    isOpen,
    onClose,
    config,
    button,
    buttonLabel,
    onColorChange,
}: ButtonStateModalProps) => {
    const buttonColors = config.global.buttonColors[button]

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${buttonLabel} Button - State Colors`}
            size="lg"
        >
            <div className="space-y-4">
                <div className="rounded-lg border border-[#1e293b] bg-[#090d16] p-3">
                    <Switch
                        label="Transparent Background (all states)"
                        checked={config.global.buttonColors[button].upBg === 'transparent'}
                        onChange={(enabled) => {
                            if (enabled) {
                                onColorChange(button, 'upBg', 'transparent')
                                onColorChange(button, 'overBg', 'transparent')
                                onColorChange(button, 'downBg', 'transparent')
                            }
                        }}
                        config={config}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        When enabled, backgrounds become transparent and only icon colors are used.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {STATES.map(({ key, label, bgKey, iconKey }) => (
                        <div
                            key={key}
                            className="rounded-lg border border-[#1e293b] bg-[#090d16] p-4"
                        >
                            <h4 className="mb-3 text-sm font-medium text-gray-300 capitalize">
                                {label} State
                            </h4>

                            <div className="space-y-3">
                                <div>
                                    <label className="mb-1 block text-xs text-gray-400">
                                        Background Color
                                    </label>
                                    <ColorInput
                                        label=""
                                        value={buttonColors[bgKey]}
                                        onChange={(v) => onColorChange(button, bgKey, v)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs text-gray-400">
                                        Icon Color
                                    </label>
                                    <ColorInput
                                        label=""
                                        value={buttonColors[iconKey]}
                                        onChange={(v) => onColorChange(button, iconKey, v)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    )
}
