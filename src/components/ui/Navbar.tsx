/**
 * @file src/components/ui/Navbar.tsx
 * @description Navigation bar component with logo, tab navigation, reset button, and GitHub link
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

interface NavbarProps {
    config: SkinConfig
    activeTab: string
    onTabChange: (tab: string) => void
    onResetToDefault: () => void
}

const NAV_TABS = [
    { id: 'global', label: 'Global' },
    { id: 'title', label: 'Title Bar' },
    { id: 'tabs', label: 'Tabs Bar' },
    { id: 'skins', label: 'My Skins' },
    { id: 'export', label: 'Export' },
    { id: 'meta', label: 'Metadata' },
] as const

const GITHUB_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
</svg>`

export const Navbar = ({ config, activeTab, onTabChange, onResetToDefault }: NavbarProps) => {
    const accentColor = config.global.colors.text
    const logoSrc = `${import.meta.env.BASE_URL}logo.svg`

    return (
        <nav
            className="mb-6 rounded-xl border border-[#1e293b] bg-[#121824] p-3 shadow-lg md:p-4"
            style={{ borderColor: `${accentColor}40` }}
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3 px-1">
                    <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: accentColor }}
                    >
                        <img src={logoSrc} alt="Logo" className="h-6 w-6 object-contain" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-white md:text-lg">
                            Yakuake Skin Generator
                        </h1>
                        <p className="text-xs text-gray-400">Create custom terminal skins</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div
                        className="flex w-full scrollbar-none items-center gap-1 overflow-x-auto pb-1 sm:w-auto lg:pb-0"
                        role="tablist"
                    >
                        {NAV_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`relative shrink-0 overflow-hidden rounded-lg px-3 py-2 text-sm font-medium transition-all md:px-4 ${
                                    activeTab === tab.id
                                        ? 'text-white shadow-md'
                                        : 'text-gray-400 hover:text-gray-200'
                                }`}
                                style={{
                                    backgroundColor:
                                        activeTab === tab.id ? accentColor : 'transparent',
                                    borderColor: activeTab === tab.id ? accentColor : 'transparent',
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="ml-auto flex items-center gap-2 sm:ml-0">
                        <button
                            type="button"
                            onClick={onResetToDefault}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
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
                        <a
                            href="https://github.com/sanguine6660/yakuake-skin-generator"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                            aria-label="GitHub Repository"
                        >
                            <span dangerouslySetInnerHTML={{ __html: GITHUB_LOGO }} />
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    )
}
