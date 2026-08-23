/**
 * @file src/hooks/useSessionStorage.ts
 * @description Custom hook for persisting state to sessionStorage with SSR support
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

import { useState, useEffect } from 'preact/hooks'

export function useSessionStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
    const readValue = (): T => {
        if (typeof window === 'undefined') {
            return initialValue
        }
        try {
            const item = window.sessionStorage.getItem(key)
            return item ? (JSON.parse(item) as T) : initialValue
        } catch (error) {
            console.warn(`Error reading sessionStorage key "${key}":`, error)
            return initialValue
        }
    }

    const [storedValue, setStoredValue] = useState<T>(readValue)

    const setValue = (value: T | ((val: T) => T)) => {
        if (typeof window === 'undefined') {
            console.warn(
                `Tried setting sessionStorage key "${key}" even though window is not defined`
            )
            return
        }
        try {
            const newValue = value instanceof Function ? value(storedValue) : value
            window.sessionStorage.setItem(key, JSON.stringify(newValue))
            setStoredValue(newValue)
        } catch (error) {
            console.warn(`Error setting sessionStorage key "${key}":`, error)
        }
    }

    useEffect(() => {
        setStoredValue(readValue())
    }, [key])

    return [storedValue, setValue]
}
