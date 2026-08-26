/**
 * @file src/utils/analytics.ts
 * @description Pure helpers that keep GoatCounter events anonymous, session-less
 * and dashboard-friendly. Event ids must be stable slugs; titles are optional
 * human-readable descriptions. User-generated content (skin names, file names,
 * error messages…) must never be sent.
 *
 * @copyright Copyright (C) 2026 sanguine6660
 * @since 1.1.0
 * @license GPL-3.0-or-later
 */

/** Hard cap so a stray dynamic value can never bloat the dashboard. */
export const MAX_EVENT_ID_LENGTH = 96

/**
 * Normalizes an event id: collapses whitespace, enforces slug-safe characters,
 * caps length. Returns null when nothing sendable remains.
 */
export const sanitizeEventId = (raw: string): string | null => {
    const cleaned = raw
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9:/.-]+/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/\/{2,}/g, '/')
        .replace(/^[-./]+|[-./]+$/g, '')
        .slice(0, MAX_EVENT_ID_LENGTH)
    return cleaned.length > 0 ? cleaned : null
}

const CONTROL_CHARS = /[\u0000-\u001f\u007f<>]/g

/** Trims and strips control/markup characters from a display title. */
export const sanitizeEventTitle = (raw: string): string | undefined => {
    const cleaned = raw.replace(CONTROL_CHARS, ' ').replace(/\s+/g, ' ').trim()
    return cleaned.length > 0 ? cleaned.slice(0, 160) : undefined
}
