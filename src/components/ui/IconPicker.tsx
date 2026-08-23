/**
 * @file src/components/ui/IconPicker.tsx
 * @description Dropdown component for selecting icons from the active icon library
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

import { useState, useRef, useEffect } from 'preact/hooks'
import type { SkinConfig, IconRole } from '../../types'
import { libraries, renderIcon } from '../../utils/iconRenderer'

interface IconPickerProps {
    config: SkinConfig
    role: IconRole
    label: string
    onChange: (iconName: string) => void
    hint?: string
}

export const IconPicker = ({ config, role, label, onChange, hint }: IconPickerProps) => {
    const currentIcon = config.global.iconSet[role]
    const lib = libraries[config.global.iconLibrary]
    const availableIcons = lib ? Object.keys(lib).filter((k) => typeof lib[k] === 'function') : []

    const [isOpen, setIsOpen] = useState(false)
    const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const displayIcon = hoveredIcon || currentIcon

    return (
        <div className="relative">
            <label className="mb-1 block flex items-center gap-2 text-xs text-gray-400">
                <span>{label}</span>
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded border border-[#1e293b] bg-[#090d16]">
                    {renderIcon(config, displayIcon, 14)}
                </div>
                {hint && <span className="text-[10px] text-gray-600">({hint})</span>}
            </label>
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    onMouseEnter={() => setHoveredIcon(currentIcon)}
                    onMouseLeave={() => setHoveredIcon(null)}
                    className="flex w-full items-center justify-between rounded-lg border border-[#1e293b] bg-[#090d16] p-2 text-left text-sm text-white transition-colors hover:border-sky-400"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span className="flex min-w-0 flex-1 items-center gap-2">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                            {renderIcon(config, currentIcon, 14)}
                        </span>
                        <span className="truncate">{currentIcon}</span>
                    </span>
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        style={{ flexShrink: 0 }}
                        className={isOpen ? 'rotate-180' : ''}
                    >
                        <path
                            d="M3,4 L6,7 L9,4"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-72 overflow-y-auto rounded-lg border border-[#1e293b] bg-[#121824] shadow-lg">
                        {availableIcons.slice(0, 120).map((icon) => (
                            <button
                                key={icon}
                                type="button"
                                onClick={() => {
                                    onChange(icon)
                                    setIsOpen(false)
                                    setHoveredIcon(null)
                                }}
                                onMouseEnter={() => setHoveredIcon(icon)}
                                onMouseLeave={() => setHoveredIcon(null)}
                                className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm ${icon === currentIcon ? 'bg-[#1e293b]' : 'hover:bg-[#1e293b]'} transition-colors`}
                            >
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded border border-[#1e293b] bg-[#090d16]">
                                    {renderIcon(config, icon, 14)}
                                </div>
                                <span className="truncate">{icon}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
