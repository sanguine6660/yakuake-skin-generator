import { describe, it, expect } from 'vitest'
import { adjustHexBrightness, deriveKonsoleBackground } from './colors'

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
