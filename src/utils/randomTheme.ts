/**
 * @file src/utils/randomTheme.ts
 * @description Random theme discovery helpers for the preset pool
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

/**
 * Picks a uniformly random item, preferring candidates that are not excluded.
 * Falls back to the full pool when every item is excluded (e.g. the currently
 * active preset is the only one), so repeated clicks always yield a result.
 * `rng` is injectable for deterministic tests.
 */
export const pickRandomItem = <T>(
    items: readonly T[],
    isExcluded: (item: T) => boolean = () => false,
    rng: () => number = Math.random
): T | null => {
    if (items.length === 0) return null

    const fresh = items.filter((item) => !isExcluded(item))
    const pool = fresh.length > 0 ? fresh : items
    const index = Math.floor(rng() * pool.length)
    return pool[Math.min(index, pool.length - 1)] ?? null
}
