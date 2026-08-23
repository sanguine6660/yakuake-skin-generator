/**
 * @file src/components/ui/CheckboxInput.tsx
 * @description Checkbox input component with label
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

interface CheckboxInputProps {
    label: string
    checked: boolean
    onChange: (value: boolean) => void
    hint?: string
}

export const CheckboxInput = ({ label, checked, onChange, hint }: CheckboxInputProps) => (
    <Label label={label} hint={hint}>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.currentTarget.checked)}
                className="h-4 w-4 accent-sky-400"
            />
            <span>{label}</span>
        </label>
    </Label>
)
