/**
 * @file src/components/forms/ExportForm.tsx
 * @description Form component for exporting skins - download tar.gz, install to Yakuake, and view saved skins
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

interface ExportFormProps {
    config: SkinConfig
    downloadSkin: (config: SkinConfig) => void
    installToYakuake: (config: SkinConfig) => void
    installStatus: { message: string; type: 'success' | 'error' | 'info' } | null
    clearStatus: () => void
    savedSkins: Record<
        string,
        { name: string; config: SkinConfig; createdAt: number; updatedAt: number }
    >
}

export const ExportForm = ({
    config,
    downloadSkin,
    installToYakuake,
    installStatus,
    clearStatus,
    savedSkins,
}: ExportFormProps) => {
    const accentColor = config.global.colors.text
    const skinFolder = config.meta.skinName.toLowerCase().replace(/[^a-z0-9]/g, '_')

    const folderStructure = `${skinFolder}/
├── logo.svg
├── title.skin
├── tabs.skin
├── title/
│   ├── background_center.svg
│   ├── background_left.svg
│   ├── background_right.svg
│   ├── config_up.svg
│   ├── config_over.svg
│   ├── config_down.svg
│   ├── focus_up.svg
│   ├── focus_over.svg
│   ├── focus_down.svg
│   ├── quit_up.svg
│   ├── quit_over.svg
│   └── quit_down.svg
└── tabs/
    ├── background_center.svg
    ├── background_left.svg
    ├── background_right.svg
    ├── tab_selected.svg
    ├── tab_unselected.svg
    ├── tab_selected_left.svg
    ├── tab_selected_middle.svg
    ├── tab_selected_right.svg
    ├── tab_unselected_left.svg
    ├── tab_unselected_middle.svg
    ├── tab_unselected_right.svg
    ├── tab_separator.svg
    ├── close_up.svg
    ├── close_over.svg
    ├── close_down.svg
    ├── lock.svg
    ├── plus_up.svg
    ├── plus_over.svg
    ├── plus_down.svg
    ├── minus_up.svg
    ├── minus_over.svg
    └── minus_down.svg`

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <button
                    onClick={() => installToYakuake(config)}
                    style={{ backgroundColor: accentColor, color: '#090d16' }}
                    className="w-full cursor-pointer rounded-xl p-4 text-lg font-bold shadow-xl transition hover:opacity-90"
                >
                    Install to Yakuake
                </button>
                <button
                    onClick={() => downloadSkin(config)}
                    style={{
                        backgroundColor: '#3b4252',
                        color: accentColor,
                        border: `1px solid ${accentColor}`,
                    }}
                    className="w-full cursor-pointer rounded-xl p-4 text-lg font-bold transition hover:opacity-90"
                >
                    Download .tar.gz
                </button>
            </div>

            {installStatus && (
                <div
                    className="rounded-lg border p-4 transition-all"
                    style={{
                        backgroundColor:
                            installStatus.type === 'error'
                                ? '#3d1a1a'
                                : installStatus.type === 'success'
                                  ? '#1a3d1a'
                                  : '#1a2d3d',
                        borderColor:
                            installStatus.type === 'error'
                                ? '#bf616a'
                                : installStatus.type === 'success'
                                  ? '#a3be8c'
                                  : '#66c2f2',
                        color:
                            installStatus.type === 'error'
                                ? '#ff6b6b'
                                : installStatus.type === 'success'
                                  ? '#a3be8c'
                                  : '#66c2f2',
                    }}
                >
                    <div className="flex items-center justify-between">
                        <p className="text-sm">{installStatus.message}</p>
                        <button
                            onClick={clearStatus}
                            className="text-lg leading-none text-gray-400 hover:text-white"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {Object.keys(savedSkins).length > 0 && (
                <div className="rounded-xl border border-[#1e293b] bg-[#121824] p-6 shadow-xl">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-200">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            style={{ color: accentColor }}
                        >
                            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
                            <path
                                d="M10 6v8M6 10h8"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                        Saved Skins - Export
                    </h3>
                    <div className="space-y-2">
                        {Object.values(savedSkins)
                            .sort((a, b) => b.updatedAt - a.updatedAt)
                            .map((skin) => (
                                <div
                                    key={skin.name}
                                    className="flex items-center justify-between rounded-lg border border-[#1e293b] bg-[#090d16] p-3"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium text-white">
                                            {skin.name}
                                        </p>
                                        <p className="truncate text-xs text-gray-400">
                                            Updated: {new Date(skin.updatedAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => downloadSkin(skin.config)}
                                        className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                                        style={{
                                            backgroundColor: '#3b4252',
                                            color: accentColor,
                                            border: `1px solid ${accentColor}`,
                                        }}
                                    >
                                        Export .tar.gz
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            <div className="rounded-xl border border-[#1e293b] bg-[#121824] p-6 shadow-xl">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-200">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        style={{ color: accentColor }}
                    >
                        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
                        <path
                            d="M10 6v8M6 10h8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                    How to Install Your Yakuake Skin
                </h3>
                <div className="space-y-4 text-sm text-gray-300">
                    <div className="space-y-3 border-l-2 border-sky-400 pl-4">
                        <div>
                            <p className="font-medium text-white">1. Download the Skin Package</p>
                            <p className="text-gray-400">
                                Click <strong>"Download .tar.gz"</strong> above. Your browser will
                                save a{' '}
                                <code className="rounded bg-gray-700 px-1.5 py-0.5 font-mono text-xs whitespace-nowrap text-sky-300">
                                    {skinFolder}.tar.gz
                                </code>{' '}
                                file.
                            </p>
                        </div>
                        <div>
                            <p className="font-medium text-white">
                                2. Extract to the Yakuake Skins Directory
                            </p>
                            <p className="text-gray-400">
                                Open your file manager and extract the downloaded{' '}
                                <code className="rounded bg-gray-700 px-1.5 py-0.5 font-mono text-xs whitespace-nowrap text-sky-300">
                                    {skinFolder}.tar.gz
                                </code>{' '}
                                archive.
                            </p>
                            <p className="mt-1 text-gray-400">
                                Place the extracted folder into your Yakuake skins directory:
                                <br />
                                <code className="rounded bg-gray-700 px-1.5 py-0.5 font-mono text-xs whitespace-nowrap text-sky-300">
                                    ~/.local/share/yakuake/skins/
                                </code>
                            </p>
                            <div className="mt-2 rounded-lg border border-gray-700 bg-gray-800/50 p-3">
                                <p className="mb-1 text-xs font-medium text-gray-400">
                                    Expected folder structure after extraction:
                                </p>
                                <pre className="overflow-x-auto font-mono text-xs text-gray-300">
                                    {folderStructure}
                                </pre>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                                <strong>Important:</strong> The folder name must match your
                                skin&apos;s identifier and contain{' '}
                                <code className="font-mono">title.skin</code> and{' '}
                                <code className="font-mono">tabs.skin</code> directly inside — not
                                nested in a subfolder.
                            </p>
                        </div>
                        <div>
                            <p className="font-medium text-white">3. Apply the Skin in Yakuake</p>
                            <ol className="mt-1 list-inside list-decimal space-y-1 text-gray-400">
                                <li>
                                    Open Yakuake (press your toggle key, usually{' '}
                                    <kbd className="rounded bg-gray-700 px-1.5 py-0.5 font-mono text-xs">
                                        F12
                                    </kbd>
                                    )
                                </li>
                                <li>
                                    Right-click the title bar →{' '}
                                    <strong>Configure Yakuake...</strong>
                                </li>
                                <li>
                                    Go to <strong>Appearance</strong> tab
                                </li>
                                <li>
                                    In the <strong>Skin</strong> dropdown, select your new skin:{' '}
                                    <strong className="text-sky-300">{config.meta.skinName}</strong>
                                </li>
                                <li>
                                    Click <strong>Apply</strong> (bottom right)
                                </li>
                            </ol>
                        </div>
                        <div>
                            <p className="font-medium text-white">
                                4. Verify & Refresh (if needed)
                            </p>
                            <p className="text-gray-400">
                                The skin should apply immediately. If it doesn&apos;t appear in the
                                list or looks wrong:
                            </p>
                            <ul className="mt-1 list-inside list-disc space-y-1 text-gray-400">
                                <li>
                                    Restart Yakuake:{' '}
                                    <code className="rounded bg-gray-700 px-1.5 py-0.5 font-mono text-xs whitespace-nowrap text-sky-300">
                                        killall yakuake && yakuake &
                                    </code>
                                </li>
                                <li>
                                    Check the extracted folder is directly in{' '}
                                    <code className="font-mono whitespace-nowrap">
                                        ~/.local/share/yakuake/skins/
                                    </code>{' '}
                                    (not in a subfolder)
                                </li>
                                <li>
                                    Verify the folder contains{' '}
                                    <code className="font-mono whitespace-nowrap">title.skin</code>{' '}
                                    and{' '}
                                    <code className="font-mono whitespace-nowrap">tabs.skin</code>{' '}
                                    at the root level
                                </li>
                            </ul>
                        </div>
                        <div className="rounded-lg border border-sky-500/30 bg-sky-500/10 p-3">
                            <p className="mb-1 font-medium text-sky-300">Pro Tip: Auto-Install</p>
                            <p className="text-sm text-gray-400">
                                Use the <strong>"Install to Yakuake"</strong> button above for
                                automatic installation. It will prompt you to select{' '}
                                <code className="font-mono whitespace-nowrap">
                                    ~/.local/share/yakuake/skins/
                                </code>{' '}
                                and extract everything automatically.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
