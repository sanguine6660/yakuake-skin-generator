/**
 * @file src/utils/analytics.test.ts
 * @description Tests for the privacy guardrails of the analytics helpers
 * @copyright Copyright (C) 2026 sanguine6660
 * @since 1.1.0
 * @license GPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import { MAX_EVENT_ID_LENGTH, sanitizeEventId, sanitizeEventTitle } from './analytics'

describe('sanitizeEventId', () => {
    it('keeps clean slugs untouched', () => {
        expect(sanitizeEventId('skin-download')).toBe('skin-download')
        expect(sanitizeEventId('preset:dracula')).toBe('preset:dracula')
        expect(sanitizeEventId('icon-set:focus:LuMaximize2')).toBe('icon-set:focus:lumaximize2')
    })

    it('normalizes casing, whitespace and junk characters', () => {
        expect(sanitizeEventId('  Skin Download!!  ')).toBe('skin-download')
        expect(sanitizeEventId('tab//Global')).toBe('tab/global')
        expect(sanitizeEventId('a   b___c')).toBe('a-b-c')
    })

    it('drops ids that are empty after cleaning', () => {
        expect(sanitizeEventId('   ')).toBeNull()
        expect(sanitizeEventId('///')).toBeNull()
    })

    it('caps pathological length', () => {
        const id = sanitizeEventId('x'.repeat(500))
        expect(id).toHaveLength(MAX_EVENT_ID_LENGTH)
    })
})

describe('sanitizeEventTitle', () => {
    it('trims and collapses whitespace', () => {
        expect(sanitizeEventTitle('  Applied   preset  ')).toBe('Applied preset')
    })

    it('strips control characters and markup delimiters', () => {
        expect(sanitizeEventTitle('<script>alert(1)</script>')).not.toContain('<')
        expect(sanitizeEventTitle('<script>alert(1)</script>')).not.toContain('>')
        expect(sanitizeEventTitle('line1\nline2\ttabbed')).toBe('line1 line2 tabbed')
    })

    it('returns undefined when nothing remains', () => {
        expect(sanitizeEventTitle('\n\n')).toBeUndefined()
    })
})
