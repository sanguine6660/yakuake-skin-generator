/**
 * @file src/components/ui/NumberInput.tsx
 * @description Number input with slider and optional value display
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

interface NumberInputProps {
    label: string
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
    step?: number
    hint?: string
    showValue?: boolean
}

export const NumberInput = ({
    label,
    value,
    onChange,
    min = 0,
    max = 500,
    step = 1,
    hint,
    showValue = true,
}: NumberInputProps) => (
    <Label label={label} hint={hint}>
        <div className="flex items-center gap-2">
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onInput={(e) => onChange(Number(e.currentTarget.value))}
                className="flex-1 cursor-pointer accent-sky-400"
            />
            {showValue && <span className="w-12 text-right text-sm text-gray-300">{value}</span>}
        </div>
    </Label>
)
