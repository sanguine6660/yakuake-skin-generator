/**
 * @file src/hooks/useGoatCounter.ts
 * @description Custom hook for tracking custom events and page views dynamically via GoatCounter
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

declare global {
    interface Window {
        goatcounter?: {
            count: (vars: { path: string; title?: string; event?: boolean }) => void
        }
    }
}

export const useGoatCounter = () => {
    /**
     * Tracks a custom event dynamically.
     * @param path The unique identifier/path for the event in the dashboard (e.g. 'skin-download')
     * @param title A human-readable description for the dashboard
     */
    const trackEvent = (path: string, title?: string): void => {
        if (typeof window !== 'undefined' && window.goatcounter) {
            try {
                window.goatcounter.count({
                    path,
                    title: title || path,
                    event: true,
                })
            } catch (error) {
                console.error(`Failed to track GoatCounter event (${path}):`, error)
            }
        } else {
            console.warn(`GoatCounter not loaded or running locally. Event skipped: ${path}`)
        }
    }

    return { trackEvent }
}
