/**
 * @file src/components/ui/RgbColorInput.tsx
 * @description RGB color input with color picker and hex text input, converts to RgbColor object
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

import { Label } from './Label'
import type { RgbColor } from '../../types'

interface RgbColorInputProps {
    label: string
    value: RgbColor
    onChange: (value: RgbColor) => void
    hint?: string
}

const rgbToHex = (color: RgbColor): string => {
    return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`
}

export const RgbColorInput = ({ label, value, onChange, hint }: RgbColorInputProps) => {
    const hex = rgbToHex(value)

    return (
        <Label label={label} hint={hint}>
            <div className="flex gap-2">
                <input
                    type="color"
                    value={hex}
                    onChange={(e) => {
                        const v = e.currentTarget.value
                        const r = parseInt(v.slice(1, 3), 16)
                        const g = parseInt(v.slice(3, 5), 16)
                        const b = parseInt(v.slice(5, 7), 16)
                        onChange({ r, g, b })
                    }}
                    className="h-9 w-9 cursor-pointer border-0 bg-transparent"
                />
                <input
                    type="text"
                    value={hex}
                    onInput={(e) => {
                        const v = e.currentTarget.value
                        if (v.length === 7 && v[0] === '#') {
                            const r = parseInt(v.slice(1, 3), 16)
                            const g = parseInt(v.slice(3, 5), 16)
                            const b = parseInt(v.slice(5, 7), 16)
                            if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
                                onChange({ r, g, b })
                            }
                        }
                    }}
                    className="w-full rounded-lg border border-[#1e293b] bg-[#090d16] p-1.5 font-mono text-sm text-white"
                />
            </div>
        </Label>
    )
}
