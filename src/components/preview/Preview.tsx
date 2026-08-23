/**
 * @file src/components/preview/Preview.tsx
 * @description Live preview component showing Yakuake layout with tabs bar (top) and title bar (bottom)
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

interface PreviewProps {
    config: SkinConfig
}

export const Preview = ({ config }: PreviewProps) => {
    const { global, title, tabs } = config
    const borderColor = `rgb(${title.borderColor.r}, ${title.borderColor.g}, ${title.borderColor.b})`
    const textColor = `rgb(${title.textColor.r}, ${title.textColor.g}, ${title.textColor.b})`
    const selectedTextColor = `rgb(${tabs.selectedColor.r}, ${tabs.selectedColor.g}, ${tabs.selectedColor.b})`
    const unselectedTextColor = `rgb(${tabs.unselectedColor.r}, ${tabs.unselectedColor.g}, ${tabs.unselectedColor.b})`

    return (
        <div className="rounded-xl border border-[#1e293b] bg-[#121824] p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-200">Live Preview</h2>

            <div className="mx-auto max-w-md overflow-hidden rounded-lg border border-[#1e293b] bg-[#090d16]">
                <div
                    style={{ backgroundColor: global.colors.bg }}
                    className="flex h-[28px] items-center gap-2 border-b border-[#1e293b] px-2"
                >
                    <div className="flex items-center gap-1">
                        <div
                            className="flex h-[16px] w-[16px] items-center justify-center"
                            style={{ backgroundColor: global.colors.dim, borderRadius: '3px' }}
                            title="New Tab"
                        >
                            {renderIcon(config, global.iconSet.plus, 10)}
                        </div>
                        <div
                            className="flex h-[16px] w-[16px] items-center justify-center"
                            style={{ backgroundColor: global.colors.dim, borderRadius: '3px' }}
                            title="Close Tab"
                        >
                            {renderIcon(config, global.iconSet.minus, 10)}
                        </div>
                    </div>

                    <div
                        className="h-4 w-[1px]"
                        style={{ backgroundColor: `${global.colors.text}40` }}
                    />

                    <div className="flex flex-1 items-center gap-1 overflow-x-auto">
                        <div
                            className="flex min-w-[70px] flex-shrink-0 items-center gap-1.5 px-3 py-1"
                            style={{
                                backgroundColor: global.colors.selected,
                                borderRadius: `${global.borderRadius}px`,
                            }}
                        >
                            {tabs.lockEnabled && (
                                <span
                                    className="flex h-4 w-4 items-center justify-center"
                                    title="Locked"
                                >
                                    {renderIcon(config, global.iconSet.lock, 8)}
                                </span>
                            )}
                            <span
                                style={{
                                    color: selectedTextColor,
                                    fontSize: '10px',
                                    fontWeight: 500,
                                    fontFamily: 'monospace',
                                }}
                            >
                                Shell
                            </span>
                            {tabs.closeBtn.enabled && (
                                <span className="ml-1 flex h-4 w-4 items-center justify-center">
                                    {renderIcon(config, global.iconSet.close, 8)}
                                </span>
                            )}
                        </div>
                        <div
                            className="min-w-[55px] flex-shrink-0 px-3 py-1 font-mono text-[10px]"
                            style={{
                                backgroundColor: global.colors.dim,
                                borderRadius: `${global.borderRadius}px`,
                                color: unselectedTextColor,
                            }}
                        >
                            htop
                        </div>
                        <div
                            className="min-w-[55px] flex-shrink-0 px-3 py-1 font-mono text-[10px]"
                            style={{
                                backgroundColor: global.colors.dim,
                                borderRadius: `${global.borderRadius}px`,
                                color: unselectedTextColor,
                            }}
                        >
                            vim
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        backgroundColor: global.colors.bg,
                        borderTop:
                            title.borderWidth > 0
                                ? `${title.borderWidth}px solid ${borderColor}`
                                : 'none',
                    }}
                    className="flex h-[28px] items-center justify-between px-3"
                >
                    <span
                        style={{
                            color: textColor,
                            fontWeight: title.textBold ? 'bold' : 'normal',
                            fontSize: '11px',
                            fontFamily: 'monospace',
                        }}
                    >
                        {title.textContent}
                    </span>

                    <div className="flex items-center gap-1">
                        <div
                            className="flex h-[20px] w-[20px] items-center justify-center"
                            style={{ backgroundColor: global.colors.bg, borderRadius: '50%' }}
                            title="Configure"
                        >
                            {renderIcon(config, global.iconSet.settings, 12)}
                        </div>

                        <div
                            className="flex h-[20px] w-[20px] items-center justify-center"
                            style={{ backgroundColor: global.colors.bg, borderRadius: '50%' }}
                            title="Maximize/Restore"
                        >
                            {renderIcon(config, global.iconSet.maximize, 12)}
                        </div>

                        <div
                            className="flex h-[20px] w-[20px] items-center justify-center"
                            style={{ backgroundColor: global.colors.bg, borderRadius: '50%' }}
                            title="Close"
                        >
                            {renderIcon(config, global.iconSet.close, 12)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 rounded-lg border border-[#1e293b] bg-[#090d16] p-3 text-xs text-gray-400">
                <p>Preview shows Yakuake layout: Tabs bar on top, Title bar on bottom.</p>
                <p className="mt-1">Icons update based on selected icon library.</p>
            </div>
        </div>
    )
}
