import { describe, it, expect } from 'vitest'
import {
    adjustHexBrightness,
    blendHex,
    deriveKonsoleBackground,
    hexToRgba,
    resolveColorInput,
} from './colors'

describe('adjustHexBrightness', () => {
    it('lightens colors', () => {
        expect(adjustHexBrightness('#000000', 255)).toBe('#ffffff')
        expect(adjustHexBrightness('#102030', 16)).toBe('#203040')
    })

    it('darkens colors', () => {
        expect(adjustHexBrightness('#203040', -16)).toBe('#102030')
    })

    it('clamps at both ends', () => {
        expect(adjustHexBrightness('#ffffff', 100)).toBe('#ffffff')
        expect(adjustHexBrightness('#000000', -100)).toBe('#000000')
    })
})

describe('resolveColorInput', () => {
    it('accepts 6-digit hex with and without #', () => {
        expect(resolveColorInput('#FFFF00')).toBe('#ffff00')
        expect(resolveColorInput('ffff00')).toBe('#ffff00')
    })

    it('expands 3-digit hex', () => {
        expect(resolveColorInput('#fff')).toBe('#ffffff')
        expect(resolveColorInput('f0a')).toBe('#ff00aa')
    })

    it('resolves CSS named colors', () => {
        expect(resolveColorInput('silver')).toBe('#c0c0c0')
        expect(resolveColorInput('crimson')).toBe('#dc143c')
        expect(resolveColorInput('RebeccaPurple')).toBe('#663399')
    })

    it('returns null for invalid input', () => {
        expect(resolveColorInput('notacolor')).toBeNull()
        expect(resolveColorInput('12345')).toBeNull()
        expect(resolveColorInput('')).toBeNull()
    })
})

describe('deriveKonsoleBackground', () => {
    it('lightens the terminal background for dark themes', () => {
        const derived = deriveKonsoleBackground('#1e2233')
        const toValue = (hex: string) => parseInt(hex.slice(1), 16)
        expect(toValue(derived)).toBeGreaterThan(toValue('#1e2233'))
    })

    it('darkens the terminal background for light themes', () => {
        const derived = deriveKonsoleBackground('#ffffff')
        const toValue = (hex: string) => parseInt(hex.slice(1), 16)
        expect(toValue(derived)).toBeLessThan(toValue('#ffffff'))
    })
})

describe('hexToRgba', () => {
    it('converts hex and named colors to rgba', () => {
        expect(hexToRgba('#ff8800', 0.5)).toBe('rgba(255, 136, 0, 0.5)')
        expect(hexToRgba('crimson', 1)).toBe('rgba(220, 20, 60, 1)')
    })

    it('expands 3-digit hex', () => {
        expect(hexToRgba('#0f0', 0.25)).toBe('rgba(0, 255, 0, 0.25)')
    })

    it('clamps alpha and passes invalid input through', () => {
        expect(hexToRgba('#000000', 5)).toBe('rgba(0, 0, 0, 1)')
        expect(hexToRgba('#000000', -1)).toBe('rgba(0, 0, 0, 0)')
        expect(hexToRgba('notacolor', 0.5)).toBe('notacolor')
    })
})

describe('blendHex', () => {
    it('blends the top color over the base by t', () => {
        expect(blendHex('#ffffff', '#000000', 0.5)).toBe('#808080')
        expect(blendHex('#ff0000', '#0000ff', 0)).toBe('#0000ff')
        expect(blendHex('#ff0000', '#0000ff', 1)).toBe('#ff0000')
    })

    it('clamps t and returns null for invalid input', () => {
        expect(blendHex('#808080', '#000000', 2)).toBe('#808080')
        expect(blendHex('#808080', '#000000', -1)).toBe('#000000')
        expect(blendHex('nope', '#000000', 0.5)).toBeNull()
    })
})
