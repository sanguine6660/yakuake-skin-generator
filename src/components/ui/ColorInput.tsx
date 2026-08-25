/**
 * @file src/components/ui/ColorInput.tsx
 * @description Color picker input with both native color picker and hex text input
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

import { useRef } from 'preact/hooks'
import { Label } from './Label'

interface ColorInputProps {
    label: string
    value: string
    onChange: (value: string) => void
    hint?: string
}

export const ColorInput = ({ label, value, onChange, hint }: ColorInputProps) => {
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleSwatchInput = (newValue: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => onChange(newValue), 120)
    }

    return (
        <Label label={label} hint={hint}>
            <div className="flex gap-2">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => handleSwatchInput(e.currentTarget.value)}
                    className="h-9 w-9 cursor-pointer border-0 bg-transparent"
                />
                <input
                    type="text"
                    value={value}
                    onInput={(e) => onChange(e.currentTarget.value)}
                    className="w-full rounded-lg border border-[#1e293b] bg-[#090d16] p-1.5 font-mono text-sm text-white"
                />
            </div>
        </Label>
    )
}