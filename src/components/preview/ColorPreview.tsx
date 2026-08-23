/**
 * @file src/components/preview/ColorPreview.tsx
 * @description Color palette preview component showing the four main colors with hex values
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

interface ColorPreviewProps {
    config: SkinConfig
}

export const ColorPreview = ({ config }: ColorPreviewProps) => {
    const { global } = config

    return (
        <div className="rounded-xl border border-[#1e293b] bg-[#121824] p-6 shadow-xl">
            <h3 className="mb-3 text-lg font-semibold text-gray-200">Color Palette Preview</h3>
            <div className="grid grid-cols-4 gap-2">
                {[
                    { name: 'Background', color: global.colors.bg },
                    { name: 'Selected', color: global.colors.selected },
                    { name: 'Text', color: global.colors.text },
                    { name: 'Dim', color: global.colors.dim },
                ].map(({ name, color }) => (
                    <div key={name} className="flex flex-col items-center gap-1">
                        <div
                            className="h-12 w-full rounded-lg border border-[#1e293b]"
                            style={{ backgroundColor: color }}
                        />
                        <span className="text-xs text-gray-400">{name}</span>
                        <span className="font-mono text-xs">{color}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
