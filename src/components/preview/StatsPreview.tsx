/**
 * @file src/components/preview/StatsPreview.tsx
 * @description Stats preview component showing current download and usage statistics
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

interface StatsPreviewProps {
    downloadsCount?: number
    savedSkinsCount?: number
}

export const StatsPreview = ({ downloadsCount = 0, savedSkinsCount = 0 }: StatsPreviewProps) => {
    return (
        <div className="rounded-xl border border-[#1e293b] bg-[#121824] p-6 shadow-xl">
            <h3 className="mb-3 text-lg font-semibold text-gray-200">Generator Stats</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center rounded-lg border border-[#1e293b] bg-[#0d1117] p-4">
                    <span className="text-2xl font-bold text-blue-400">{downloadsCount}</span>
                    <span className="mt-1 text-xs text-gray-400">Total Downloads</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border border-[#1e293b] bg-[#0d1117] p-4">
                    <span className="text-2xl font-bold text-emerald-400">{savedSkinsCount}</span>
                    <span className="mt-1 text-xs text-gray-400">Saved Skins</span>
                </div>
            </div>
        </div>
    )
}
