/**
 * @file src/components/ui/Navbar.tsx
 * @description Navigation bar component with logo, grouped tab navigation (incl. Bars dropdown), controls, and GitHub link; themed live from the edited skin config
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

import { useRef, useState } from 'preact/hooks'
import type { SkinConfig } from '../../types'
import type { RandomSkinHistoryEntry } from '../../utils/randomSkinGenerator'
import { blendHex, hexToRgba, relativeLuminance } from '../../utils/colors'
import { Popover } from './Popover'

interface NavbarProps {
    config: SkinConfig
    activeTab: string
    onTabChange: (tab: string) => void
    onResetToDefault: () => void
    onRandomizeSkin: () => void
    randomHistory: RandomSkinHistoryEntry[]
    onRestoreRandomSkin: (entry: RandomSkinHistoryEntry) => void
    onClearRandomHistory: () => void
    onUndo: () => void
    onRedo: () => void
    canUndo: boolean
    canRedo: boolean
}

const LEADING_TABS = [
    { id: 'global', label: 'Global', short: 'Global' },
    { id: 'meta', label: 'Metadata', short: 'Meta' },
] as const

const BARS_SUBTABS = [
    { id: 'title', label: 'Title Bar', short: 'Title' },
    { id: 'tabs', label: 'Tabs Bar', short: 'Tabs' },
] as const

const TRAILING_TABS = [
    { id: 'terminal', label: 'Terminal', short: 'Term' },
    { id: 'export', label: 'Import/Export', short: 'Export' },
    { id: 'skins', label: 'My Skins', short: 'Skins' },
] as const

interface NavTab {
    id: string
    label: string
    short: string
}

/** Page backdrop the translucent navbar floats over; used for luminance blending */
const PAGE_BG = '#090d16'

const GITHUB_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
</svg>`

export const Navbar = ({
    config,
    activeTab,
    onTabChange,
    onResetToDefault,
    onRandomizeSkin,
    randomHistory,
    onRestoreRandomSkin,
    onClearRandomHistory,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
}: NavbarProps) => {
    const logoSrc = `${import.meta.env.BASE_URL}logo.svg`
    const [historyOpen, setHistoryOpen] = useState(false)
    const historyTriggerRef = useRef<HTMLButtonElement>(null)
    const [barsOpen, setBarsOpen] = useState(false)
    const barsTriggerRef = useRef<HTMLButtonElement>(null)

    const { colors, borderRadius, opacity, translucency } = config.global
    const accent = colors.text

    // Translucent skins let the page show through; opacity slider drives how much
    const surfaceAlpha = translucency ? Math.min(0.95, Math.max(0.6, opacity / 100)) : 1
    const popoverSurface = hexToRgba(colors.bg, Math.max(surfaceAlpha, 0.97))

    // Readability guards: judge contrast against what is actually rendered
    // (skin bg blended over the page bg) and flip ink tones for light skins.
    const renderedSurface = blendHex(colors.bg, PAGE_BG, surfaceAlpha) ?? colors.bg
    const lightSurface = relativeLuminance(renderedSurface) > 0.45
    const onAccent = relativeLuminance(accent) > 0.55 ? '#10141f' : '#ffffff'
    const navRadius = `${Math.min(Math.max(borderRadius, 3), 14)}px`

    // Theme tokens consumed by Tailwind arbitrary-value utilities; re-declared
    // inside popovers since portals do not inherit variables from <nav>.
    const navVars: Record<string, string> = {
        '--nb-radius': navRadius,
        '--nb-surface': hexToRgba(colors.bg, surfaceAlpha),
        '--nb-accent': accent,
        '--nb-on-accent': onAccent,
        '--nb-ink': lightSurface ? '#0b1120' : '#f8fafc',
        '--nb-muted': lightSurface ? 'rgba(15, 23, 42, 0.68)' : 'rgba(203, 213, 225, 0.78)',
        '--nb-faint': lightSurface ? 'rgba(15, 23, 42, 0.42)' : 'rgba(148, 163, 184, 0.85)',
        '--nb-hover': hexToRgba(accent, 0.16),
        '--nb-divider': hexToRgba(accent, 0.28),
    }

    const activeBarSubtab = BARS_SUBTABS.find((tab) => tab.id === activeTab)
    const barsActive = activeBarSubtab !== undefined

    const renderTabButton = ({ id, label, short }: NavTab) => {
        const isActive = activeTab === id
        return (
            <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(id)}
                className={`relative shrink-0 overflow-hidden rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all sm:px-3 md:px-4 md:text-sm ${
                    isActive ? 'shadow-md' : 'text-[var(--nb-muted)] hover:text-[var(--nb-ink)]'
                }`}
                style={{
                    color: isActive ? 'var(--nb-on-accent)' : undefined,
                    backgroundColor: isActive ? 'var(--nb-accent)' : 'transparent',
                }}
            >
                <span className="sm:hidden">{short}</span>
                <span className="hidden sm:inline">{label}</span>
            </button>
        )
    }

    return (
        <nav
            className="rounded-[var(--nb-radius)] border p-2.5 shadow-lg sm:p-3 md:p-4"
            style={{
                ...navVars,
                backgroundColor: 'var(--nb-surface)',
                borderColor: hexToRgba(accent, 0.35),
            }}
        >
            <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center xl:gap-4">
                <div className="flex min-w-0 items-center gap-3 px-1">
                    <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center"
                        style={{
                            backgroundColor: accent,
                            borderRadius: `min(${navRadius}, 10px)`,
                        }}
                    >
                        <img src={logoSrc} alt="Logo" className="h-6 w-6 object-contain" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="truncate text-base font-bold text-[var(--nb-ink)] md:text-lg">
                            Yakuake Skin Generator
                        </h1>
                        <p className="truncate text-xs text-[var(--nb-muted)]">
                            Create custom terminal skins
                        </p>
                    </div>
                </div>

                <div className="flex min-w-0 flex-col gap-2 xl:flex-1 xl:flex-row xl:items-center xl:justify-end xl:gap-2">
                    <div
                        className="flex w-full min-w-0 [scrollbar-width:none] items-center gap-0.5 overflow-x-auto pb-1 sm:w-auto sm:gap-1 sm:pb-0 [&::-webkit-scrollbar]:hidden"
                        role="tablist"
                    >
                        {LEADING_TABS.map(renderTabButton)}

                        <button
                            type="button"
                            ref={barsTriggerRef}
                            role="tab"
                            aria-selected={barsActive}
                            aria-haspopup="menu"
                            aria-expanded={barsOpen}
                            onClick={() => setBarsOpen((open) => !open)}
                            className={`relative inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all sm:px-3 md:px-4 md:text-sm ${
                                barsActive || barsOpen
                                    ? 'shadow-md'
                                    : 'text-[var(--nb-muted)] hover:bg-[var(--nb-hover)] hover:text-[var(--nb-ink)]'
                            }`}
                            style={{
                                color: barsActive || barsOpen ? 'var(--nb-on-accent)' : undefined,
                                backgroundColor:
                                    barsActive || barsOpen ? 'var(--nb-accent)' : 'transparent',
                            }}
                        >
                            <span className="sm:hidden">Bars</span>
                            <span className="hidden sm:inline">
                                {barsActive ? `Bars · ${activeBarSubtab.short}` : 'Bars'}
                            </span>
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`shrink-0 transition-transform duration-150 ${
                                    barsOpen ? 'rotate-180' : ''
                                }`}
                                aria-hidden="true"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>

                        {TRAILING_TABS.map(renderTabButton)}
                    </div>

                    <div className="flex w-full items-center gap-1 xl:ml-auto xl:w-auto">
                        {[
                            {
                                label: 'Undo',
                                shortcut: 'Ctrl+Z',
                                enabled: canUndo,
                                action: onUndo,
                                icon: (
                                    <>
                                        <path d="M9 14 4 9l5-5" />
                                        <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
                                    </>
                                ),
                            },
                            {
                                label: 'Redo',
                                shortcut: 'Ctrl+Shift+Z',
                                enabled: canRedo,
                                action: onRedo,
                                icon: (
                                    <>
                                        <path d="m15 14 5-5-5-5" />
                                        <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />
                                    </>
                                ),
                            },
                        ].map(({ label, shortcut, enabled, action, icon }) => (
                            <button
                                key={label}
                                type="button"
                                onClick={enabled ? action : undefined}
                                disabled={!enabled}
                                className={`rounded-lg p-1.5 transition-colors sm:p-2 ${
                                    enabled
                                        ? 'text-[var(--nb-muted)] hover:bg-[var(--nb-hover)] hover:text-[var(--nb-accent)]'
                                        : 'cursor-default text-[var(--nb-faint)]'
                                }`}
                                title={`${label} (${shortcut})`}
                                aria-label={`${label} last change`}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    {icon}
                                </svg>
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={onRandomizeSkin}
                            className="rounded-lg p-1.5 text-[var(--nb-muted)] transition-colors hover:bg-[var(--nb-hover)] hover:text-[var(--nb-accent)] sm:p-2"
                            title="Generate a random skin theme"
                            aria-label="Generate a random skin theme"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="3" width="18" height="18" rx="4" />
                                <circle cx="8.5" cy="8.5" r="1" fill="currentColor" />
                                <circle cx="15.5" cy="15.5" r="1" fill="currentColor" />
                                <circle cx="12" cy="12" r="1" fill="currentColor" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            ref={historyTriggerRef}
                            onClick={() => setHistoryOpen((open) => !open)}
                            className={`relative rounded-lg p-1.5 transition-colors hover:bg-[var(--nb-hover)] sm:p-2 ${
                                historyOpen
                                    ? 'text-[var(--nb-accent)]'
                                    : 'text-[var(--nb-muted)] hover:text-[var(--nb-ink)]'
                            }`}
                            title="Previously rolled skins"
                            aria-label="Previously rolled skins"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                                <path d="M12 7v5l4 2" />
                            </svg>
                        </button>
                        {historyOpen && historyTriggerRef.current && (
                            <Popover
                                triggerRef={historyTriggerRef}
                                onClose={() => setHistoryOpen(false)}
                                width={280}
                                style={{
                                    backgroundColor: popoverSurface,
                                    borderColor: hexToRgba(accent, 0.3),
                                }}
                            >
                                <div className="p-2" style={navVars}>
                                    <div className="flex items-center justify-between px-2 py-1">
                                        <span className="text-xs font-semibold tracking-wide text-[var(--nb-faint)] uppercase">
                                            Rolled skins
                                        </span>
                                        {randomHistory.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={onClearRandomHistory}
                                                className="text-[11px] text-[var(--nb-faint)] transition-colors hover:text-red-400"
                                            >
                                                Clear all
                                            </button>
                                        )}
                                    </div>
                                    {randomHistory.length === 0 ? (
                                        <div className="px-2 pt-1 pb-3 text-center">
                                            <p className="text-sm text-[var(--nb-muted)]">
                                                No rolls yet
                                            </p>
                                            <p className="mt-1 text-xs text-[var(--nb-faint)]">
                                                Hit the dice to roll your first random theme.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="max-h-72 space-y-1 overflow-y-auto">
                                            {randomHistory.map((entry) => {
                                                const c = entry.config.global.colors
                                                return (
                                                    <button
                                                        key={entry.id}
                                                        type="button"
                                                        onClick={() => {
                                                            onRestoreRandomSkin(entry)
                                                            setHistoryOpen(false)
                                                        }}
                                                        className="flex w-full items-center gap-2 rounded-lg p-2 text-left transition-colors hover:bg-[var(--nb-hover)]"
                                                    >
                                                        <span className="flex shrink-0 overflow-hidden rounded-md border border-black/50">
                                                            <span
                                                                className="h-6 w-3"
                                                                style={{ background: c.bg }}
                                                            />
                                                            <span
                                                                className="h-6 w-3"
                                                                style={{ background: c.selected }}
                                                            />
                                                            <span
                                                                className="h-6 w-3"
                                                                style={{ background: c.dim }}
                                                            />
                                                            <span
                                                                className="h-6 w-3"
                                                                style={{ background: c.text }}
                                                            />
                                                        </span>
                                                        <span className="min-w-0 flex-1">
                                                            <span className="block truncate text-sm text-[var(--nb-ink)]">
                                                                {entry.name}
                                                            </span>
                                                            <span className="block text-[11px] text-[var(--nb-faint)]">
                                                                {new Date(
                                                                    entry.appliedAt
                                                                ).toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })}
                                                            </span>
                                                        </span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </Popover>
                        )}
                        <button
                            type="button"
                            onClick={onResetToDefault}
                            className="rounded-lg p-1.5 text-[var(--nb-muted)] transition-colors hover:bg-[var(--nb-hover)] hover:text-[var(--nb-ink)] sm:p-2"
                            title="Reset to default settings"
                            aria-label="Reset to default settings"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                            </svg>
                        </button>
                        <span
                            className="mx-0.5 h-5 w-px shrink-0 bg-[var(--nb-divider)]"
                            aria-hidden="true"
                        />
                        <a
                            href="https://github.com/sanguine6660/yakuake-skin-generator"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto shrink-0 rounded-lg p-1.5 text-[var(--nb-muted)] transition-colors hover:bg-[var(--nb-hover)] hover:text-[var(--nb-ink)] sm:p-2 xl:ml-0"
                            aria-label="GitHub Repository"
                        >
                            <span dangerouslySetInnerHTML={{ __html: GITHUB_LOGO }} />
                        </a>
                    </div>
                </div>
            </div>

            {barsOpen && barsTriggerRef.current && (
                <Popover
                    triggerRef={barsTriggerRef}
                    onClose={() => setBarsOpen(false)}
                    width={190}
                    style={{
                        backgroundColor: popoverSurface,
                        borderColor: hexToRgba(accent, 0.3),
                    }}
                >
                    <div role="menu" className="p-1.5" style={navVars}>
                        <p className="px-2 pt-1 pb-1.5 text-xs font-semibold tracking-wide text-[var(--nb-faint)] uppercase">
                            Title &amp; Tabs Bars
                        </p>
                        {BARS_SUBTABS.map((tab) => {
                            const isActive = activeTab === tab.id
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="menuitemradio"
                                    aria-checked={isActive}
                                    onClick={() => {
                                        onTabChange(tab.id)
                                        setBarsOpen(false)
                                    }}
                                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors ${
                                        isActive
                                            ? 'bg-[var(--nb-hover)] text-[var(--nb-ink)]'
                                            : 'text-[var(--nb-muted)] hover:bg-[var(--nb-hover)] hover:text-[var(--nb-ink)]'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    {isActive && (
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke={accent}
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M20 6 9 17l-5-5" />
                                        </svg>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </Popover>
            )}
        </nav>
    )
}
