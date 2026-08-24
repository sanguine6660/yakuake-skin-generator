/**
 * @file src/components/preview/StatsPreview.tsx
 * @description Stats preview component showing per-visitor generator usage statistics
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
    totalDownloads?: number | null
    exportCount?: number
    savedSkinsCount?: number
    favoritePreset?: string
    favoritePresetCount?: number
    favoriteIconLibrary?: string
    favoriteIconLibraryCount?: number
}

export const StatsPreview = ({
    totalDownloads,
    exportCount = 0,
    savedSkinsCount = 0,
    favoritePreset,
    favoritePresetCount = 0,
    favoriteIconLibrary,
    favoriteIconLibraryCount = 0,
}: StatsPreviewProps) => {
    const stats = [
        {
            value: String(exportCount),
            label: 'Your Exports',
            caption: 'downloads & installs',
            color: 'text-blue-400',
        },
        {
            value: String(savedSkinsCount),
            label: 'Saved Skins',
            caption: 'this browser',
            color: 'text-emerald-400',
        },
        {
            value: favoritePreset ?? '—',
            label: 'Top Preset',
            caption: favoritePreset ? `${favoritePresetCount}× applied` : 'none yet',
            color: 'text-purple-400',
        },
        {
            value: favoriteIconLibrary ?? '—',
            label: 'Top Icon Lib',
            caption: favoriteIconLibrary ? `${favoriteIconLibraryCount}× used` : 'none yet',
            color: 'text-amber-400',
        },
    ]

    return (
        <div className="rounded-xl border border-[#1e293b] bg-[#121824] p-6 shadow-xl">
            <h3 className="mb-3 text-lg font-semibold text-gray-200">Generator Stats</h3>
            <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 flex flex-col items-center justify-center rounded-lg border border-[#1e293b] bg-[#0d1117] p-4">
                    <span className="text-3xl font-bold text-sky-400">
                        {totalDownloads == null ? '…' : totalDownloads.toLocaleString()}
                    </span>
                    <span className="mt-1 text-xs text-gray-400">Total Skin Downloads</span>
                    <span className="text-[10px] text-gray-500">by everyone, all time</span>
                </div>
                {stats.map(({ value, label, caption, color }) => (
                    <div
                        key={label}
                        className="flex flex-col items-center justify-center rounded-lg border border-[#1e293b] bg-[#0d1117] p-4"
                    >
                        <span className={`max-w-full truncate text-xl font-bold ${color}`}>
                            {value}
                        </span>
                        <span className="mt-1 text-xs text-gray-400">{label}</span>
                        <span className="text-[10px] text-gray-500">{caption}</span>
                    </div>
                ))}
            </div>
            <p className="mt-3 text-center text-[10px] text-gray-500">
                personal stats are stored locally in your browser
            </p>
        </div>
    )
}
