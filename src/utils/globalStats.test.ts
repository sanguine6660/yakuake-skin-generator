/**
 * @file src/utils/globalStats.test.ts
 * @description Tests for the Abacus-backed global statistics helpers
 * @copyright Copyright (C) 2026 sanguine6660
 * @since 1.1.0
 * @license GPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { GLOBAL_STAT_KEYS, formatStatCount, statEndpoint, fetchStat, hitStat } from './globalStats'

afterEach(() => vi.unstubAllGlobals())

describe('statEndpoint', () => {
    it('builds namespaced get/hit URLs', () => {
        expect(statEndpoint('downloads', 'get')).toBe(
            'https://abacus.jasoncameron.dev/get/yakuake_skin_generator/downloads'
        )
        expect(statEndpoint('random-skins', 'hit')).toBe(
            'https://abacus.jasoncameron.dev/hit/yakuake_skin_generator/random-skins'
        )
    })
})

describe('formatStatCount', () => {
    it('formats compact community numbers', () => {
        expect(formatStatCount(null)).toBe('…')
        expect(formatStatCount(0)).toBe('0')
        expect(formatStatCount(950)).toBe('950')
        expect(formatStatCount(4200)).toBe('4.2k')
        expect(formatStatCount(12000)).toBe('12k')
        expect(formatStatCount(3_400_000)).toBe('3.4M')
    })
})

describe('fetchStat / hitStat', () => {
    it('parses plain-number and {value} responses', async () => {
        vi.stubGlobal(
            'fetch',
            vi
                .fn()
                .mockResolvedValueOnce(new Response('42'))
                .mockResolvedValueOnce(new Response(JSON.stringify({ value: 43 }), { status: 200 }))
        )
        await expect(fetchStat('downloads')).resolves.toBe(42)
        await expect(hitStat('downloads')).resolves.toBe(43)
    })

    it('treats 404 as zero and failures as null', async () => {
        vi.stubGlobal(
            'fetch',
            vi
                .fn()
                .mockResolvedValueOnce(new Response('', { status: 404 }))
                .mockRejectedValueOnce(new Error('offline'))
        )
        await expect(fetchStat('imports')).resolves.toBe(0)
        await expect(hitStat('imports')).resolves.toBeNull()
    })

    it('rejects unknown keys without network access', async () => {
        const fetchSpy = vi.fn()
        vi.stubGlobal('fetch', fetchSpy)
        const result = await hitStat('not-a-key' as never)
        expect(result).toBeNull()
        expect(fetchSpy).not.toHaveBeenCalled()
        expect(GLOBAL_STAT_KEYS.length).toBeGreaterThan(3)
    })
})
