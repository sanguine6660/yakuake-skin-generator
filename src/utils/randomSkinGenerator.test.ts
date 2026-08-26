/**
 * @file src/utils/randomSkinGenerator.test.ts
 * @description Tests for the generative random skin engine: determinism,
 * contrast guarantees, palette validity and structural preservation.
 *
 * @copyright Copyright (C) 2026 sanguine6660
 * @since 1.1.0
 * @license GPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import { DEFAULT_ICON_SETS } from '../constants'
import { createDefaultSkinConfig } from '../constants'
import type { IconLibrary, SkinConfig } from '../types'
import {
    contrastRatio,
    generateRandomSkin,
    generateSkinName,
    pushRandomSkinEntry,
} from './randomSkinGenerator'

/** Deterministic PRNG (mulberry32) for reproducible tests. */
const mulberry32 =
    (seed: number): (() => number) =>
    () => {
        seed |= 0
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }

const HEX = /^#[0-9a-f]{6}$/
const base: SkinConfig = createDefaultSkinConfig()

describe('generateRandomSkin', () => {
    it('is deterministic for the same seed', () => {
        const a = generateRandomSkin(base, mulberry32(1234))
        const b = generateRandomSkin(base, mulberry32(1234))
        expect(a).toEqual(b)
    })

    it('does not mutate the input config', () => {
        const snapshot = structuredClone(base)
        generateRandomSkin(base, mulberry32(7))
        expect(base).toEqual(snapshot)
    })

    it('produces valid hex colors across many seeds', () => {
        for (let seed = 0; seed < 60; seed++) {
            const { global } = generateRandomSkin(base, mulberry32(seed))
            const { bg, selected, text, dim, konsoleBackground } = global.colors
            for (const color of [bg, selected, text, dim, konsoleBackground]) {
                expect(color).toMatch(HEX)
            }
            for (const button of Object.values(global.buttonColors)) {
                for (const color of Object.values(button)) {
                    expect(String(color)).toMatch(HEX)
                }
            }
        }
    })

    it('always passes WCAG AA text contrast against the background', () => {
        for (let seed = 0; seed < 80; seed++) {
            const { global } = generateRandomSkin(base, mulberry32(seed * 7 + 3))
            expect(contrastRatio(global.colors.text, global.colors.bg)).toBeGreaterThanOrEqual(4.5)
        }
    })

    it('keeps chrome layers subtle relative to the background', () => {
        for (let seed = 0; seed < 60; seed++) {
            const { global } = generateRandomSkin(base, mulberry32(seed + 100))
            const ratioDim = contrastRatio(global.colors.dim, global.colors.bg)
            const ratioSelected = contrastRatio(global.colors.selected, global.colors.bg)
            // Chrome must be distinguishable but never louder than the accent.
            expect(ratioDim).toBeGreaterThan(1)
            expect(ratioDim).toBeLessThan(ratioSelected || 21)
        }
    })

    it('follows preset button state conventions', () => {
        const skin = generateRandomSkin(base, mulberry32(99))
        const { quit, focus } = skin.global.buttonColors
        expect(focus.upBg).toBe(skin.global.colors.dim)
        expect(focus.overBg).toBe(skin.global.colors.selected)
        expect(focus.downIcon).toBe(skin.global.colors.bg)
        // Destructive buttons get their own danger treatment.
        expect(quit.downIcon).toBe('#ffffff')
    })

    it('randomizes to a valid icon library with its default icon set', () => {
        for (let seed = 0; seed < 30; seed++) {
            const { global } = generateRandomSkin(base, mulberry32(seed))
            const libraries = Object.keys(DEFAULT_ICON_SETS) as IconLibrary[]
            expect(libraries).toContain(global.iconLibrary)
            expect(global.iconSet).toEqual(DEFAULT_ICON_SETS[global.iconLibrary])
        }
    })

    it('preserves structural settings while re-theming', () => {
        const customized: SkinConfig = {
            ...base,
            title: { ...base.title, focusBtn: { ...base.title.focusBtn, x: 42, y: 9 } },
            tabs: { ...base.tabs, plusBtn: { ...base.tabs.plusBtn, x: 17 } },
        }
        const skin = generateRandomSkin(customized, mulberry32(5))
        expect(skin.title.focusBtn.x).toBe(42)
        expect(skin.title.focusBtn.y).toBe(9)
        expect(skin.tabs.plusBtn.x).toBe(17)
    })

    it('applies the generated name to both title bar and metadata', () => {
        const skin = generateRandomSkin(base, mulberry32(11))
        expect(skin.title.textContent.trim().length).toBeGreaterThan(2)
        expect(skin.meta.skinName).toBe(skin.title.textContent)
        expect(skin.meta.skinName).not.toBe(base.meta.skinName)
    })

    it('stamps tool attribution onto author, email and website', () => {
        for (let seed = 0; seed < 10; seed++) {
            const { meta } = generateRandomSkin(base, mulberry32(seed))
            expect(meta.author).toBe('sanguine6660')
            expect(meta.email).toBe('sanguine6660@gmail.com')
            expect(meta.web).toBe('https://github.com/sanguine6660/yakuake-skin-generator')
        }
    })
})

describe('generateSkinName', () => {
    it('uses hue-appropriate color words', () => {
        const reds = generateSkinName(5, 70, false)
        expect(reds.split(/ |\b/)).toContainEqual(
            expect.stringMatching(/Crimson|Scarlet|Ruby|Ember/)
        )
        const blues = generateSkinName(210, 70, false)
        expect(blues).toMatch(/Azure|Cobalt|Ocean|Cyan/)
    })

    it('never returns an empty name across seeds', () => {
        for (let seed = 0; seed < 50; seed++) {
            const name = generateSkinName((seed * 37) % 360, 65, seed % 2 === 0, mulberry32(seed))
            expect(name.length).toBeGreaterThan(2)
        }
    })
})

describe('pushRandomSkinEntry', () => {
    const entry = (name: string) => ({
        name,
        appliedAt: 1000,
        config: createDefaultSkinConfig(),
    })

    it('prepends the newest entry', () => {
        const history = pushRandomSkinEntry([], entry('first'))
        const next = pushRandomSkinEntry(history, entry('second'))
        expect(next[0].name).toBe('second')
        expect(next[1].name).toBe('first')
    })

    it('caps the history at the limit (default 10)', () => {
        let history = [] as ReturnType<typeof pushRandomSkinEntry>
        for (let i = 0; i < 25; i++) {
            history = pushRandomSkinEntry(history, entry(`roll-${i}`))
        }
        expect(history).toHaveLength(10)
        expect(history[0].name).toBe('roll-24')
        expect(history.at(-1)!.name).toBe('roll-15')
    })

    it('assigns unique ids and never mutates the input array', () => {
        const original = pushRandomSkinEntry([], entry('a'))
        const snapshot = structuredClone(original)
        const next = pushRandomSkinEntry(original, entry('b'))
        expect(original).toEqual(snapshot)
        expect(next[0].id).not.toBe(next[1].id)
    })
})
