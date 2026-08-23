/**
 * @file src/components/ui/TextInput.tsx
 * @description Text input component with label and optional hint
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

interface TextInputProps {
    label: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    hint?: string
}

export const TextInput = ({ label, value, onChange, placeholder, hint }: TextInputProps) => (
    <Label label={label} hint={hint}>
        <input
            type="text"
            value={value}
            onInput={(e) => onChange(e.currentTarget.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-[#1e293b] bg-[#090d16] p-2 text-sm text-white"
        />
    </Label>
)
