/**
 * @file src/components/ui/SelectInput.tsx
 * @description Select dropdown input component with label and options
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

interface SelectInputProps {
    label: string
    value: string
    onChange: (value: string) => void
    options: { value: string; label: string }[]
    hint?: string
}

export const SelectInput = ({ label, value, onChange, options, hint }: SelectInputProps) => (
    <Label label={label} hint={hint}>
        <select
            value={value}
            onChange={(e) => onChange(e.currentTarget.value)}
            className="w-full rounded-lg border border-[#1e293b] bg-[#090d16] p-2 text-sm text-white"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </Label>
)
