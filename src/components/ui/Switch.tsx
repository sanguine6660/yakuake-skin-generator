/**
 * @file src/components/ui/Switch.tsx
 * @description Custom toggle switch component with icon indicators
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

import type { SkinConfig } from '../../types'
import { renderIcon } from '../../utils/iconRenderer'

interface SwitchProps {
    label: string
    checked: boolean
    onChange: (checked: boolean) => void
    disabled?: boolean
    config: SkinConfig
}

export const Switch = ({ label, checked, onChange, disabled, config }: SwitchProps) => {
    const id = `switch-${label.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).slice(2, 9)}`

    return (
        <label className="relative flex cursor-pointer items-center gap-3">
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={(e) => onChange(e.currentTarget.checked)}
                disabled={disabled}
                className="peer h-5 w-11 cursor-pointer appearance-none rounded-full bg-gray-600 transition-colors duration-300 checked:bg-green-500"
            />
            <label
                htmlFor={id}
                className="absolute top-1/2 left-0 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-white shadow-sm transition-transform duration-300 peer-checked:translate-x-5.5 peer-checked:border-green-500"
            >
                {checked
                    ? renderIcon(config, config.global.iconSet.maximize, 8, '#166534')
                    : renderIcon(config, config.global.iconSet.close, 8, '#991b1b')}
            </label>
            <span className="text-sm text-gray-300">{label}</span>
        </label>
    )
}
