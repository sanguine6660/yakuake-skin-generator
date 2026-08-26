/**
 * @file src/hooks/useGoatCounter.ts
 * @description Anonymous, session-less event tracking via GoatCounter with
 * queueing for the async script and graceful handling of blocked/missing
 * trackers. Also exposes a standalone trackEvent() for non-hook contexts.
 *
 * Privacy guarantees:
 * - every send uses { event: true, no_session: true } (no sessions)
 * - GoatCounter sets no cookies; nothing user-generated is ever sent
 * - disabled entirely inside the Tauri desktop app
 *
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
import { sanitizeEventId, sanitizeEventTitle } from '../utils/analytics'
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
                title: event.title,
                event: true,
                // Session-less counting: every event stands alone, no visitor
                // profiles, no returning-visitor detection.
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

/**
 * Sends an anonymous, session-less usage event. Safe to call anywhere
 * (components, hooks, error boundaries); a no-op in the desktop app, during
 * SSR and when the tracker is blocked (events queue briefly, then drop).
 *
 * `id` must be a stable slug without user content; `title` is an optional
 * human-readable description shown in the dashboard.
 */
export const trackEvent = (id: string, title?: string): void => {
    if (isTauri()) return
    if (typeof window === 'undefined') return

    const path = sanitizeEventId(id)
    if (!path) {
        console.warn('Dropped analytics event with unusable id:', JSON.stringify(id))
        return
    }

    const cleanTitle = title ? sanitizeEventTitle(title) : undefined

    if (isGoatCounterReady()) {
        try {
            window.goatcounter!.count({
                path,
                ...(cleanTitle ? { title: cleanTitle } : {}),
                event: true,
                no_session: true,
            })
        } catch (error) {
            console.error(`Failed to track GoatCounter event (${path}):`, error)
        }
        return
    }

    if (eventQueue.length < MAX_QUEUE_SIZE) {
        const queued: GoatCounterEvent = { path }
        if (cleanTitle) queued.title = cleanTitle
        eventQueue.push(queued)
        scheduleFlush()
    } else {
        console.warn(`GoatCounter not loaded or blocked. Event dropped: ${path}`)
    }
}

export const useGoatCounter = () => {
    const track = useCallback((id: string, title?: string): void => {
        trackEvent(id, title)
    }, [])

    return { trackEvent: track }
}
