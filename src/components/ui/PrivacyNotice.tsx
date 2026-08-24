/**
 * @file src/components/ui/PrivacyNotice.tsx
 * @description Privacy and analytics notice banner shown once per visitor until accepted
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

interface PrivacyNoticeProps {
    onAccept: () => void
    onClose: () => void
}

export const PrivacyNotice = ({ onAccept, onClose }: PrivacyNoticeProps) => {
    return (
        <div
            className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl rounded-xl border border-[#1e293b] bg-[#121824] p-5 shadow-2xl"
            role="dialog"
            aria-label="Privacy and analytics notice"
        >
            <button
                type="button"
                onClick={onClose}
                aria-label="Close notice"
                className="absolute right-3 top-3 rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-800 hover:text-white"
            >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path
                        d="M15 5L5 15M5 5l10 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            <h3 className="mb-2 pr-8 text-sm font-semibold text-gray-200">
                Privacy &amp; Analytics Note
            </h3>
            <p className="text-xs leading-relaxed text-gray-400">
                This site uses lightweight, privacy-focused analytics via GoatCounter. While it is
                generally cookie-free, a transient session cookie may occasionally be set depending
                on browser state or administrative access. No cross-site tracking or personal data
                is profiled. If you prefer to opt out entirely, feel free to block it using your
                adblocker (e.g., uBlock Origin)—the skin generator runs 100% locally in your
                browser and functions completely independently of analytics.
            </p>

            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    onClick={onAccept}
                    className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-[#090d16] transition hover:opacity-90"
                    style={{ backgroundColor: '#66c2f2' }}
                >
                    Accept
                </button>
            </div>
        </div>
    )
}