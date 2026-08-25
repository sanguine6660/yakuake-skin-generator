/**
 * @file src/components/ui/ColorPicker.tsx
 * @description Themed color picker popover with saturation/value area, hue slider and hex/rgb input modes
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
import {
    hexToHsv,
    hsvToHex,
    hsvToHsl,
    hslToHsv,
    resolveColorInput,
    type Hsv,
} from '../../utils/colors'

interface ColorPickerProps {
    value: string
    onChange: (hex: string) => void
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
    const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(value))
    const [hexText, setHexText] = useState(() => value.replace('#', '').toLowerCase())
    const [mode, setMode] = useState<'hex' | 'rgb' | 'hsl'>('hex')
    const svRef = useRef<HTMLDivElement>(null)
    const draggingRef = useRef(false)
    const hexDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const lastCommittedRef = useRef(value)
    useEffect(() => {
        if (value.toLowerCase() === lastCommittedRef.current.toLowerCase()) return
        if (hexDebounceRef.current) clearTimeout(hexDebounceRef.current)
        setHsv(hexToHsv(value))
        setHexText(value.replace('#', '').toLowerCase())
        lastCommittedRef.current = value
    }, [value])

    const commit = (h: number, s: number, v: number) => {
        const hex = hsvToHex(h, s, v)
        lastCommittedRef.current = hex
        setHsv({ h, s, v })
        setHexText(hex.replace('#', '').toLowerCase())
        onChange(hex)
    }

    const applySvPointer = (clientX: number, clientY: number) => {
        const rect = svRef.current?.getBoundingClientRect()
        if (!rect) return
        const s = clamp((clientX - rect.left) / rect.width, 0, 1)
        const v = 1 - clamp((clientY - rect.top) / rect.height, 0, 1)
        commit(hsv.h, s, v)
    }

    const handleSvPointerDown = (e: PointerEvent) => {
        draggingRef.current = true
        applySvPointer(e.clientX, e.clientY)
        const move = (ev: PointerEvent) => {
            if (draggingRef.current) applySvPointer(ev.clientX, ev.clientY)
        }
        const up = () => {
            draggingRef.current = false
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
    }

    const currentHex = hsvToHex(hsv.h, hsv.s, hsv.v)
    const rgb = {
        r: parseInt(currentHex.slice(1, 3), 16),
        g: parseInt(currentHex.slice(3, 5), 16),
        b: parseInt(currentHex.slice(5, 7), 16),
    }
    const hsl = hsvToHsl(hsv)

    const setHslChannel = (channel: 'h' | 's' | 'l', raw: string) => {
        const max = channel === 'h' ? 360 : 100
        const num = clamp(parseInt(raw, 10) || 0, 0, max)
        const next = hslToHsv({ ...hsl, [channel]: num })
        commit(next.h, next.s, next.v)
    }

    const setChannel = (channel: 'r' | 'g' | 'b', raw: string) => {
        const num = clamp(parseInt(raw, 10) || 0, 0, 255)
        const offsets = { r: 0, g: 2, b: 4 } as const
        const updated =
            currentHex.slice(1, offsets[channel]) +
            num.toString(16).padStart(2, '0') +
            currentHex.slice(offsets[channel] + 3)
        const next = hexToHsv(`#${updated}`)
        commit(next.h, next.s, next.v)
    }

    const resolveHex = (raw: string): boolean => {
        const resolved = resolveColorInput(raw)
        if (!resolved) return false
        const next = hexToHsv(resolved)
        lastCommittedRef.current = resolved
        setHsv(next)
        setHexText(resolved.replace('#', ''))
        onChange(resolved)
        return true
    }

    const handleHexInput = (raw: string) => {
        setHexText(raw.trim().replace(/^#/, ''))
        if (hexDebounceRef.current) clearTimeout(hexDebounceRef.current)
        hexDebounceRef.current = setTimeout(() => resolveHex(raw), 800)
    }

    const handleHexPaste = (e: ClipboardEvent) => {
        const pasted = e.clipboardData?.getData('text') ?? ''
        if (resolveHex(pasted)) e.preventDefault()
    }

    const channelInput = (channel: 'r' | 'g' | 'b') => (
        <div className="flex flex-1 flex-col items-center gap-0.5">
            <input
                type="text"
                inputMode="numeric"
                value={rgb[channel]}
                onInput={(e) => setChannel(channel, (e.target as HTMLInputElement).value)}
                className="w-full rounded-md border border-[#1e293b] bg-[#090d16] px-1 py-1.5 text-center font-mono text-xs text-white focus:border-[#66c2f2] focus:outline-none"
                aria-label={channel.toUpperCase()}
            />
            <span className="text-[10px] font-medium text-gray-500">{channel.toUpperCase()}</span>
        </div>
    )

    return (
        <div className="w-full p-3" role="dialog" aria-label="Color picker">
            <div
                ref={svRef}
                className="relative h-36 w-full cursor-crosshair rounded-lg"
                style={{
                    background: `linear-gradient(to top, #000, rgba(0,0,0,0)), linear-gradient(to right, #fff, hsl(${hsv.h} 100% 50%))`,
                }}
                onPointerDown={handleSvPointerDown}
            >
                <div
                    className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
                    style={{
                        left: `${hsv.s * 100}%`,
                        top: `${(1 - hsv.v) * 100}%`,
                        backgroundColor: currentHex,
                    }}
                />
            </div>

            <input
                type="range"
                min={0}
                max={360}
                step={1}
                value={Math.round(hsv.h)}
                onInput={(e) => commit(Number((e.target as HTMLInputElement).value), hsv.s, hsv.v)}
                className="mt-3 h-3 w-full cursor-pointer appearance-none rounded-full [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
                style={{
                    background:
                        'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                }}
                aria-label="Hue"
            />

            <div className="mt-3 flex rounded-lg border border-[#1e293b] p-0.5">
                {(['hex', 'rgb', 'hsl'] as const).map((m) => (
                    <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={`flex-1 rounded-md px-2 py-1 text-[10px] font-semibold uppercase transition-colors ${
                            mode === m
                                ? 'bg-[#66c2f2] text-[#090d16]'
                                : 'text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        {m}
                    </button>
                ))}
            </div>

            <div className="mt-2 flex items-center gap-2">
                {mode === 'hsl' ? (
                    <div className="flex flex-1 gap-1.5">
                        <div className="flex flex-1 flex-col items-center gap-0.5">
                            <input
                                type="text"
                                inputMode="numeric"
                                value={Math.round(hsl.h)}
                                onInput={(e) =>
                                    setHslChannel('h', (e.target as HTMLInputElement).value)
                                }
                                className="w-full rounded-md border border-[#1e293b] bg-[#090d16] p-1.5 text-center font-mono text-xs text-white focus:border-[#66c2f2] focus:outline-none"
                                aria-label="Hue"
                            />
                            <span className="text-[10px] font-medium text-gray-500">H</span>
                        </div>
                        <div className="flex flex-1 flex-col items-center gap-0.5">
                            <input
                                type="text"
                                inputMode="numeric"
                                value={Math.round(hsl.s)}
                                onInput={(e) =>
                                    setHslChannel('s', (e.target as HTMLInputElement).value)
                                }
                                className="w-full rounded-md border border-[#1e293b] bg-[#090d16] p-1.5 text-center font-mono text-xs text-white focus:border-[#66c2f2] focus:outline-none"
                                aria-label="Saturation"
                            />
                            <span className="text-[10px] font-medium text-gray-500">S %</span>
                        </div>
                        <div className="flex flex-1 flex-col items-center gap-0.5">
                            <input
                                type="text"
                                inputMode="numeric"
                                value={Math.round(hsl.l)}
                                onInput={(e) =>
                                    setHslChannel('l', (e.target as HTMLInputElement).value)
                                }
                                className="w-full rounded-md border border-[#1e293b] bg-[#090d16] p-1.5 text-center font-mono text-xs text-white focus:border-[#66c2f2] focus:outline-none"
                                aria-label="Lightness"
                            />
                            <span className="text-[10px] font-medium text-gray-500">L %</span>
                        </div>
                    </div>
                ) : mode === 'hex' ? (
                    <div className="flex flex-1 items-center gap-1.5">
                        <span className="font-mono text-sm text-gray-500">#</span>
                        <input
                            type="text"
                            value={hexText}
                            onInput={(e) => handleHexInput((e.target as HTMLInputElement).value)}
                            onPaste={handleHexPaste}
                            spellcheck={false}
                            className="w-full rounded-md border border-[#1e293b] bg-[#090d16] p-1.5 font-mono text-sm text-white lowercase focus:border-[#66c2f2] focus:outline-none"
                            aria-label="Hex color value"
                        />
                    </div>
                ) : (
                    <div className="flex flex-1 gap-1.5">
                        {channelInput('r')}
                        {channelInput('g')}
                        {channelInput('b')}
                    </div>
                )}
            </div>
        </div>
    )
}
