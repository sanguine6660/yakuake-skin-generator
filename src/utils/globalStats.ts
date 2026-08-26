/**
 * @file src/utils/globalStats.ts
 * @description Pure helpers for the anonymous global usage counters backed by
 * the public Abacus count API (integers only, no user data).
 *
 * @copyright Copyright (C) 2026 sanguine6660
 * @since 1.1.0
 * @license GPL-3.0-or-later
 */

export const STATS_API = 'https://abacus.jasoncameron.dev'
export const STATS_NAMESPACE = 'yakuake_skin_generator'

export const GLOBAL_STAT_KEYS = [
    'downloads',
    'random-skins',
    'imports',
    'presets-applied',
    'skins-saved',
    'app-opens',
] as const

export type GlobalStatKey = (typeof GLOBAL_STAT_KEYS)[number]

/** Build an Abacus endpoint URL (`get` reads, `hit` increments and returns). */
export const statEndpoint = (key: GlobalStatKey, action: 'get' | 'hit'): string =>
    `${STATS_API}/${action}/${STATS_NAMESPACE}/${key}`

const isValidStatKey = (key: string): key is GlobalStatKey =>
    (GLOBAL_STAT_KEYS as readonly string[]).includes(key)

/**
 * Increments a counter via sendBeacon-style fetch when possible. Fire-and-
 * forget: resolves false on any failure so callers never need to react.
 */
export const hitStat = async (key: GlobalStatKey): Promise<number | null> => {
    if (!isValidStatKey(key)) return null
    try {
        const res = await fetch(statEndpoint(key, 'hit'))
        if (!res.ok) return null
        const data: unknown = await res.json()
        const value =
            typeof data === 'number' ? data : ((data as { value?: number })?.value ?? null)
        return typeof value === 'number' ? value : null
    } catch {
        return null
    }
}

export const fetchStat = async (key: GlobalStatKey): Promise<number | null> => {
    if (!isValidStatKey(key)) return null
    try {
        const res = await fetch(statEndpoint(key, 'get'))
        if (res.status === 404) return 0
        if (!res.ok) return null
        const data: unknown = await res.json()
        const value =
            typeof data === 'number' ? data : ((data as { value?: number })?.value ?? null)
        return typeof value === 'number' ? value : null
    } catch {
        return null
    }
}

/** Compact human formatting for big counters: 950 → "950", 4200 → "4.2k". */
export const formatStatCount = (value: number | null): string => {
    if (value == null) return '…'
    if (value < 1000) return value.toLocaleString()
    if (value < 1_000_000) {
        const k = value / 1000
        return `${k >= 100 ? Math.round(k) : Math.round(k * 10) / 10}k`
    }
    const m = value / 1_000_000
    return `${Math.round(m * 10) / 10}M`
}
