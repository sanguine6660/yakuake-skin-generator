/**
 * @file src/components/ui/Label.tsx
 * @description Label wrapper component with optional hint text
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

import type { ComponentChildren } from 'preact'

interface LabelProps {
    label: string
    children: ComponentChildren
    hint?: string
}

export const Label = ({ label, children, hint }: LabelProps) => (
    <div>
        <label className="mb-1 block flex items-center gap-1 text-xs text-gray-400">
            {label}
            {hint && <span className="text-[10px] text-gray-600">({hint})</span>}
        </label>
        {children}
    </div>
)
