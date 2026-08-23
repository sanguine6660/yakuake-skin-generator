/**
 * @file src/components/ui/Tabs.tsx
 * @description Tab navigation and tab panel components for the UI
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

import type { ComponentChildren } from 'preact'

interface Tab {
    id: string
    label: string
    icon?: string
}

interface TabsProps {
    tabs: Tab[]
    activeTab: string
    onChange: (tabId: string) => void
    className?: string
}

export const Tabs = ({ tabs, activeTab, onChange, className = '' }: TabsProps) => {
    return (
        <div className={className}>
            <div className="mb-4 flex border-b border-[#1e293b]">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onChange(tab.id)}
                        className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === tab.id
                                ? 'border-sky-400 text-white'
                                : 'border-transparent text-gray-400 hover:border-gray-700 hover:text-gray-200'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

interface TabPanelProps {
    activeTab: string
    tabId: string
    children: ComponentChildren
}

export const TabPanel = ({ activeTab, tabId, children }: TabPanelProps) => {
    if (activeTab !== tabId) return null
    return <div>{children}</div>
}
