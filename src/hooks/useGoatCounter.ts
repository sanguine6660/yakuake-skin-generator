/**
 * @file src/hooks/useGoatCounter.ts
 * @description Custom hook for tracking custom events via GoatCounter with queueing for the async script and graceful handling of blocked/missing trackers
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

import { useCallback } from 'preact/hooks'
import { isTauri } from '../utils'

declare global {
    interface Window {
        goatcounter?: {
            count: (vars: {
                path: string
                title?: string
                referrer?: string
                event?: boolean
                no_session?: boolean
            }) => void
        }
    }
}

interface GoatCounterEvent {
    path: string
    title?: string
}

const MAX_QUEUE_SIZE = 20
const FLUSH_INTERVAL_MS = 500
const MAX_FLUSH_ATTEMPTS = 40

const eventQueue: GoatCounterEvent[] = []
let flushTimer: ReturnType<typeof setInterval> | null = null

const isGoatCounterReady = (): boolean =>
    typeof window !== 'undefined' &&
    !!window.goatcounter &&
    typeof window.goatcounter.count === 'function'

const flushQueue = (): boolean => {
    if (!isGoatCounterReady()) return false
    while (eventQueue.length > 0) {
        const event = eventQueue.shift()!
        try {
            window.goatcounter!.count({
                path: event.path,
                title: event.title || event.path,
                event: true,
                no_session: true,
            })
        } catch (error) {
            console.error(`Failed to track GoatCounter event (${event.path}):`, error)
        }
    }
    return true
}

const scheduleFlush = (): void => {
    if (flushTimer !== null || eventQueue.length === 0) return
    let attempts = 0
    flushTimer = setInterval(() => {
        attempts++
        if (flushQueue()) {
            clearInterval(flushTimer!)
            flushTimer = null
        } else if (attempts >= MAX_FLUSH_ATTEMPTS) {
            clearInterval(flushTimer!)
            flushTimer = null
            eventQueue.length = 0
        }
    }, FLUSH_INTERVAL_MS)
}

export const useGoatCounter = () => {
    const trackEvent = useCallback((path: string, title?: string): void => {
        // The desktop app must not phone home to analytics.
        if (isTauri()) return
        if (typeof window === 'undefined') return

        if (isGoatCounterReady()) {
            try {
                window.goatcounter!.count({
                    path,
                    title: title || path,
                    event: true,
                    no_session: true,
                })
            } catch (error) {
                console.error(`Failed to track GoatCounter event (${path}):`, error)
            }
            return
        }

        if (eventQueue.length < MAX_QUEUE_SIZE) {
            eventQueue.push({ path, title })
            scheduleFlush()
        } else {
            console.warn(`GoatCounter not loaded or blocked. Event dropped: ${path}`)
        }
    }, [])

    return { trackEvent }
}
