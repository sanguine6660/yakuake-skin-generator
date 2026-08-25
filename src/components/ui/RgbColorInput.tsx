/**
 * @file src/components/ui/RgbColorInput.tsx
 * @description RGB color input with themed picker popover and hex text field
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

import { useEffect, useRef, useState } from 'preact/hooks'
import { Label } from './Label'
import { ColorPicker } from './ColorPicker'
import { Popover } from './Popover'
import { resolveColorInput } from '../../utils/colors'
import type { RgbColor } from '../../types'

interface RgbColorInputProps {
    label: string
    value: RgbColor
    onChange: (value: RgbColor) => void
    hint?: string
}

const rgbToHex = (color: RgbColor): string => {
    return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`
}

const hexToRgb = (hex: string): RgbColor => {
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
    }
}

export const RgbColorInput = ({ label, value, onChange, hint }: RgbColorInputProps) => {
    const hex = rgbToHex(value)
    const [pickerOpen, setPickerOpen] = useState(false)
    const [text, setText] = useState(hex)
    const containerRef = useRef<HTMLDivElement>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (resolveColorInput(hex)) setText(hex)
    }, [hex])

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [])

    const resolveHex = (raw: string): boolean => {
        const resolved = resolveColorInput(raw)
        if (!resolved) return false
        onChange(hexToRgb(resolved))
        setText(resolved)
        return true
    }

    const handleInput = (raw: string) => {
        setText(raw)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => resolveHex(raw), 800)
    }

    const handlePaste = (e: ClipboardEvent) => {
        const pasted = e.clipboardData?.getData('text') ?? ''
        if (resolveHex(pasted)) e.preventDefault()
    }

    return (
        <Label label={label} hint={hint}>
            <div className="flex gap-2">
                <div className="relative shrink-0" ref={containerRef}>
                    <button
                        type="button"
                        onClick={() => setPickerOpen((open) => !open)}
                        className="h-9 w-9 rounded-lg border border-[#1e293b] shadow-inner transition-colors hover:border-[#66c2f2]"
                        style={{ backgroundColor: hex }}
                        aria-label={`${label}: open color picker`}
                        title="Open color picker"
                    />
                    {pickerOpen && (
                        <Popover triggerRef={containerRef} onClose={() => setPickerOpen(false)}>
                            <div className="p-3">
                                <ColorPicker
                                    value={hex}
                                    onChange={(hexValue) => onChange(hexToRgb(hexValue))}
                                />
                            </div>
                        </Popover>
                    )}
                </div>
                <input
                    type="text"
                    value={text}
                    onInput={(e) => handleInput((e.target as HTMLInputElement).value)}
                    onPaste={handlePaste}
                    spellcheck={false}
                    className="w-full rounded-lg border border-[#1e293b] bg-[#090d16] p-1.5 font-mono text-sm text-white lowercase focus:border-[#66c2f2] focus:outline-none"
                    aria-label={label}
                />
            </div>
        </Label>
    )
}
