import { describe, it, expect } from 'vitest'
import { PRESETS, getPresetsByCategory } from './presets'

const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace('#', '')
    return {
        r: parseInt(cleanHex.substring(0, 2), 16) || 0,
        g: parseInt(cleanHex.substring(2, 4), 16) || 0,
        b: parseInt(cleanHex.substring(4, 6), 16) || 0,
    }
}

describe('PRESETS', () => {
    it('contains 10 dark and 10 light presets', () => {
        expect(getPresetsByCategory('dark')).toHaveLength(10)
        expect(getPresetsByCategory('light')).toHaveLength(10)
    })

    it('derives the title text color from the preset palette', () => {
        for (const preset of PRESETS) {
            const expected = hexToRgb(preset.previewColors.text)
            expect(
                preset.config.title?.textColor,
                `${preset.id}: title textColor should match the palette text color`
            ).toEqual(expected)
        }
    })

    it('derives the tab text color from the preset palette', () => {
        for (const preset of PRESETS) {
            const expected = hexToRgb(preset.previewColors.text)
            expect(
                preset.config.tabs?.selectedColor,
                `${preset.id}: tab selectedColor should match the palette text color`
            ).toEqual(expected)
        }
    })

    it('derives button state colors from the preset palette', () => {
        for (const preset of PRESETS) {
            const colors = preset.config.global?.colors!
            const buttonColors = preset.config.global?.buttonColors!
            expect(buttonColors.focus.upBg, preset.id).toBe(colors.dim)
            expect(buttonColors.focus.upIcon, preset.id).toBe(colors.text)
            expect(buttonColors.focus.overBg, preset.id).toBe(colors.selected)
            expect(buttonColors.focus.downBg, preset.id).toBe(colors.text)
            expect(buttonColors.focus.downIcon, preset.id).toBe(colors.bg)
        }
    })

    it('keeps the red accent for pressed quit buttons', () => {
        for (const preset of PRESETS) {
            expect(preset.config.global?.buttonColors?.quit.downBg).toBe('#bf616a')
        }
    })

    it('derives the terminal background from the preset palette', () => {
        for (const preset of PRESETS) {
            expect(preset.config.global?.colors?.konsoleBackground, preset.id).toBeTruthy()
            expect(preset.config.global?.colors?.konsoleBackground, preset.id).not.toBe(
                preset.previewColors.bg
            )
        }
    })
})
