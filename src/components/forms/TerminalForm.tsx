/**
 * @file src/components/forms/TerminalForm.tsx
 * @description Form component for the Konsole color scheme companion — full
 * control over background, foreground, all 8 ANSI slots in their three
 * intensities, opacity and a live sample terminal.
 *
 * @copyright Copyright (C) 2026 sanguine6660
 * @since 1.2.0
 * @license GPL-3.0-or-later
 */

import { useMemo } from 'preact/hooks'
import type { RgbColor, SkinConfig } from '../../types'
import { Section, Switch } from '../ui'
import { RgbColorInput } from '../ui/RgbColorInput'
import { generateColorschemeText, rgbToHex } from '../../utils/konsoleScheme'

interface TerminalFormProps {
    config: SkinConfig
    onUpdate: (updates: Partial<SkinConfig['terminal']>) => void
    onAnsiSlotChange: (
        variant: 'ansi' | 'ansiIntense' | 'ansiFaint',
        index: number,
        color: RgbColor
    ) => void
    onDeriveFromPalette: () => void
}

const ANSI_LABELS = ['Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White']

export const TerminalForm = ({
    config,
    onUpdate,
    onAnsiSlotChange,
    onDeriveFromPalette,
}: TerminalFormProps) => {
    const accentColor = config.global.colors.text
    // The form edits `config.terminal`; the app layer guarantees it exists by
    // deriving whenever a skin is loaded/rolled/preset-applied. This fallback
    // keeps the form resilient anyway.
    const scheme = config.terminal ?? {
        opacity: config.global.opacity,
        background: { r: 30, g: 34, b: 51 },
        backgroundIntense: { r: 40, g: 45, b: 62 },
        backgroundFaint: { r: 30, g: 34, b: 51 },
        foreground: { r: 220, g: 224, b: 232 },
        foregroundIntense: { r: 255, g: 255, b: 255 },
        foregroundFaint: { r: 140, g: 145, b: 155 },
        ansi: [],
        ansiIntense: [],
        ansiFaint: [],
    }

    const slot = (variant: 'ansi' | 'ansiIntense' | 'ansiFaint', index: number): RgbColor =>
        scheme[variant]?.[index] ?? { r: 128, g: 128, b: 128 }

    const sampleLines = useMemo(
        () => [
            { text: 'yakuake-skin-generator', color: scheme.foregroundIntense, bold: true },
            { text: 'v' + '1.2.0 — ready', color: scheme.ansi?.[2] ?? accentColor },
            { text: '$ ls ~/skins/', color: scheme.foreground },
            { text: 'drwxr-xr-x  themes/', color: scheme.ansi?.[4] ?? accentColor, bold: false },
            { text: '-rwxr-xr-x  install.sh*', color: scheme.ansi?.[2] ?? accentColor },
            { text: '-rw-r--r--  notes.md', color: scheme.foregroundFaint ?? scheme.foreground },
            { text: '$ echo "hello world"', color: scheme.foreground },
            { text: 'hello world', color: scheme.ansi?.[3] ?? accentColor },
        ],
        [scheme]
    )

    return (
        <div className="space-y-6">
            <Section
                title="Konsole Color Scheme"
                description="Shipped alongside your skin as a .colorscheme companion for the terminal area itself"
            >
                <div className="mb-5 rounded-lg border border-[#1e293b] bg-[#090d16] p-4">
                    <Switch
                        label="Ship Konsole color scheme (.colorscheme)"
                        checked={scheme.enabled !== false}
                        onChange={(checked) => onUpdate({ enabled: checked })}
                        config={config}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        When on, every export bundles a matching scheme and the preview terminal
                        uses it.
                    </p>
                </div>

                <div className="mb-5 flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={onDeriveFromPalette}
                        className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition hover:opacity-90"
                        style={{
                            backgroundColor: '#3b4252',
                            color: accentColor,
                            border: `1px solid ${accentColor}`,
                        }}
                    >
                        Re-derive from skin palette
                    </button>
                    <span className="text-xs text-gray-500">
                        Install to <code className="text-gray-400">~/.local/share/konsole/</code>{' '}
                        and select it under Appearance → Color scheme
                    </span>
                </div>

                {/* Live sample terminal */}
                <div
                    className="mb-6 overflow-hidden rounded-lg border border-black/50 font-mono text-[12px] leading-relaxed"
                    style={{
                        backgroundColor: rgbToHex(scheme.background),
                        opacity: Math.max(0.35, scheme.opacity / 100) ** 0.5 || 1,
                    }}
                >
                    <div className="px-3 py-2">
                        {sampleLines.map((line, i) => (
                            <div
                                key={i}
                                style={{
                                    color: rgbToHex(line.color),
                                    fontWeight: line.bold ? 'bold' : undefined,
                                }}
                            >
                                {line.text}
                            </div>
                        ))}
                        <div style={{ color: rgbToHex(scheme.ansi?.[7] ?? scheme.foreground) }}>
                            $ <span className="animate-pulse">▊</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <RgbColorInput
                        label="Terminal Background"
                        value={scheme.background}
                        onChange={(color) => onUpdate({ background: color })}
                        hint="also emitted as BackgroundFaint"
                    />
                    <RgbColorInput
                        label="Background (Intense)"
                        value={scheme.backgroundIntense}
                        onChange={(color) => onUpdate({ backgroundIntense: color })}
                    />
                    <RgbColorInput
                        label="Text Foreground"
                        value={scheme.foreground}
                        onChange={(color) => onUpdate({ foreground: color })}
                    />
                    <RgbColorInput
                        label="Foreground (Intense)"
                        value={scheme.foregroundIntense}
                        onChange={(color) => onUpdate({ foregroundIntense: color })}
                    />
                    <RgbColorInput
                        label="Foreground (Faint)"
                        value={scheme.foregroundFaint}
                        onChange={(color) => onUpdate({ foregroundFaint: color })}
                    />
                    <div className="flex flex-col justify-center">
                        <label className="mb-1 block text-sm text-gray-300">
                            Opacity ({Math.round(scheme.opacity)}%)
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={Math.round(scheme.opacity)}
                            onInput={(e) =>
                                onUpdate({
                                    opacity: Number((e.target as HTMLInputElement).value),
                                })
                            }
                            className="w-full accent-[#66c2f2]"
                        />
                    </div>
                </div>
            </Section>

            <Section title="ANSI Palette" description="Colors 0–7 in all three intensities">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] border-collapse">
                        <thead>
                            <tr>
                                <th className="w-24" />
                                {ANSI_LABELS.map((label) => (
                                    <th
                                        key={label}
                                        className="px-1 pb-2 text-center text-[11px] font-medium text-gray-400"
                                    >
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(['ansi', 'ansiIntense', 'ansiFaint'] as const).map((variant) => (
                                <tr key={variant}>
                                    <td className="pr-2 text-right text-[11px] text-gray-500">
                                        {variant === 'ansi'
                                            ? 'Normal'
                                            : variant === 'ansiIntense'
                                              ? 'Intense'
                                              : 'Faint'}
                                    </td>
                                    {ANSI_LABELS.map((_, index) => (
                                        <td key={index} className="p-0.5">
                                            <RgbColorInput
                                                label=""
                                                value={slot(variant, index)}
                                                onChange={(color) =>
                                                    onAnsiSlotChange(variant, index, color)
                                                }
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Section>

            <details className="rounded-xl border border-[#1e293b] bg-[#121824] p-4 shadow-xl">
                <summary className="cursor-pointer text-sm font-medium text-gray-300">
                    Generated .colorscheme preview
                </summary>
                <pre className="mt-3 max-h-72 overflow-auto rounded-lg bg-black/40 p-3 font-mono text-[11px] text-gray-300">
                    {generateColorschemeText(
                        config.terminal ?? {
                            opacity: 100,
                            background: { r: 0, g: 0, b: 0 },
                            backgroundIntense: { r: 0, g: 0, b: 0 },
                            backgroundFaint: { r: 0, g: 0, b: 0 },
                            foreground: { r: 255, g: 255, b: 255 },
                            foregroundIntense: { r: 255, g: 255, b: 255 },
                            foregroundFaint: { r: 255, g: 255, b: 255 },
                            ansi: Array.from({ length: 8 }, () => ({ r: 0, g: 0, b: 0 })),
                            ansiIntense: Array.from({ length: 8 }, () => ({ r: 0, g: 0, b: 0 })),
                            ansiFaint: Array.from({ length: 8 }, () => ({ r: 0, g: 0, b: 0 })),
                        }
                    )}
                </pre>
            </details>
        </div>
    )
}
