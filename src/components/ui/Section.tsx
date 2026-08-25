/**
 * @file src/components/ui/Section.tsx
 * @description Reusable card section component with title, optional description and optional color/icon
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

interface SectionProps {
    title: string
    description?: string
    children: ComponentChildren
    color?: string
    iconColor?: string
}

export const Section = ({ title, description, children, color, iconColor }: SectionProps) => (
    <section className="rounded-xl border border-[#1e293b] bg-[#121824] p-6 shadow-xl">
        <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-gray-200">
            <span style={{ color: color || iconColor }}>{title}</span>
        </h2>
        {description && <p className="mb-4 text-xs text-gray-500">{description}</p>}
        <div className={description ? '' : 'mt-4'}>{children}</div>
    </section>
)
