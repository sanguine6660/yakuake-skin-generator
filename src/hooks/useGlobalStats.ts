/**
 * @file src/hooks/useGlobalStats.ts
 * @description Global, anonymous usage counters (integer-as-a-service via the
 * public Abacus API). Loads all community counters once and exposes fire-and-
 * forget increments. Integers only — no user content ever leaves the browser.
 *
 * @copyright Copyright (C) 2026 sanguine6660
 * @since 1.1.0
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

import { useCallback, useEffect, useState } from 'preact/hooks'
import { GLOBAL_STAT_KEYS, fetchStat, hitStat } from '../utils/globalStats'
import type { GlobalStatKey } from '../utils/globalStats'

export type GlobalStats = Record<GlobalStatKey, number | null>

const EMPTY_STATS = Object.fromEntries(GLOBAL_STAT_KEYS.map((key) => [key, null])) as GlobalStats

export const useGlobalStats = () => {
    const [stats, setStats] = useState<GlobalStats>(EMPTY_STATS)

    useEffect(() => {
        let cancelled = false
        void Promise.all(
            GLOBAL_STAT_KEYS.map(async (key) => [key, await fetchStat(key)] as const)
        ).then((entries) => {
            if (cancelled) return
            setStats(Object.fromEntries(entries) as GlobalStats)
        })
        return () => {
            cancelled = true
        }
    }, [])

    /** Fire-and-forget increment; optimistically updates the local snapshot. */
    const incrementStat = useCallback((key: GlobalStatKey): void => {
        setStats((prev) => (prev[key] == null ? prev : { ...prev, [key]: (prev[key] ?? 0) + 1 }))
        void hitStat(key).then((value) => {
            if (value != null) setStats((prev) => ({ ...prev, [key]: value }))
        })
    }, [])

    return { stats, incrementStat }
}
