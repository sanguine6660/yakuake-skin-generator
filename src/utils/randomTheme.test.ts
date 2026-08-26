/**
 * @file src/utils/randomTheme.test.ts
 * @description Tests for the random preset picker used by the Randomize button
 * @copyright Copyright (C) 2026 sanguine6660
 * @since 1.1.0
 * @license GPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import { pickRandomItem } from './randomTheme'

const pool = ['a', 'b', 'c', 'd']

describe('pickRandomItem', () => {
    it('returns an element of the pool', () => {
        expect(pool).toContain(pickRandomItem(pool))
    })

    it('never returns an excluded item while alternatives exist', () => {
        // Deterministic sweep over all possible rng values.
        for (let i = 0; i < 1000; i++) {
            const picked = pickRandomItem(
                pool,
                (item) => item === 'a',
                () => i / 1000
            )
            expect(picked).not.toBe('a')
        }
    })

    it('falls back to the full pool when everything is excluded', () => {
        expect(pickRandomItem(['only'], () => true)).toBe('only')
        expect(
            pickRandomItem(
                pool,
                () => true,
                () => 0.99
            )
        ).toBe('d')
    })

    it('is deterministic for a seeded rng', () => {
        let seed = 42
        const rng = () => {
            seed = (seed * 16807) % 2147483647
            return seed / 2147483647
        }
        const first = pickRandomItem(pool, undefined, rng)
        seed = 42
        expect(pickRandomItem(pool, undefined, rng)).toBe(first)
    })

    it('returns null for an empty pool', () => {
        expect(pickRandomItem([])).toBeNull()
    })

    it('clamps floating point edge cases to valid indices', () => {
        expect(pickRandomItem(pool, undefined, () => 0.9999999)).toBe('d')
        expect(pickRandomItem(pool, undefined, () => 0)).toBe('a')
    })
})
