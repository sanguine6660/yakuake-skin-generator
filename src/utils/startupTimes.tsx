/**
 * @file src/utils/startupTimes.tsx
 * @description Records app startup durations to localStorage and provides the average as a loading-time fallback
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

import { useEffect } from 'preact/hooks'
import { useLocalStorage } from '../hooks/useLocalStorage'

export interface StartupTimeEntry {
    start: number
    loaded: number
    duration: number
}

const STARTUP_TIMES_KEY = 'yakuake-startup-times'
const MAX_ENTRIES = 100

export const StartupTimesRecorder = ({ start, loaded }: { start: number; loaded: number }) => {
    const [, setTimes] = useLocalStorage<StartupTimeEntry[]>(STARTUP_TIMES_KEY, [])

    useEffect(() => {
        setTimes((prev) =>
            [...prev, { start, loaded, duration: loaded - start }].slice(-MAX_ENTRIES)
        )
    }, [])

    return null
}

export const readAverageStartupTime = (): number => {
    try {
        const raw = localStorage.getItem(STARTUP_TIMES_KEY)
        const times: StartupTimeEntry[] = raw ? JSON.parse(raw) : []
        if (!Array.isArray(times) || times.length === 0) return 0
        return times.reduce((sum, entry) => sum + entry.duration, 0) / times.length
    } catch {
        return 0
    }
}
