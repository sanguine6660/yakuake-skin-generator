import { describe, it, expect } from 'vitest'
import {
    exportConfigJson,
    parseConfigJson,
    encodeConfigHash,
    decodeConfigHash,
} from './configSerialization'
import { createDefaultSkinConfig } from '../constants'
import type { SkinConfig } from '../types'

const config = createDefaultSkinConfig()

describe('exportConfigJson', () => {
    it('produces valid JSON containing the skin name', () => {
        const json = exportConfigJson(config)
        expect(JSON.parse(json).meta.skinName).toBe(config.meta.skinName)
    })
})

describe('parseConfigJson', () => {
    it('round-trips a full configuration', () => {
        const parsed = parseConfigJson(exportConfigJson(config))
        expect(parsed).toEqual(config)
    })

    it('fills missing sections from defaults', () => {
        const partial = {
            meta: { skinName: 'Partial' },
            title: { textContent: 'Partial' },
            tabs: {},
            global: { colors: { bg: '#010203' } },
        }
        const parsed = parseConfigJson(JSON.stringify(partial))
        expect(parsed.meta.skinName).toBe('Partial')
        expect(parsed.title.textContent).toBe('Partial')
        expect(parsed.title.textColor).toEqual(config.title.textColor)
        expect(parsed.global.colors.bg).toBe('#010203')
        expect(parsed.global.colors.konsoleBackground).toBe(config.global.colors.konsoleBackground)
        expect(parsed.global.iconSet).toEqual(config.global.iconSet)
        expect(parsed.global.buttonColors.focus).toEqual(config.global.buttonColors.focus)
        expect(parsed.tabs.selectedColor).toEqual(config.tabs.selectedColor)
    })

    it('throws on garbage input', () => {
        expect(() => parseConfigJson('not json')).toThrow()
    })

    it('throws when sections are missing', () => {
        expect(() => parseConfigJson('{"meta": {}}')).toThrow()
        expect(() => parseConfigJson('[]')).toThrow()
        expect(() => parseConfigJson('null')).toThrow()
    })
})

describe('config hash sharing', () => {
    it('round-trips a configuration through the hash', () => {
        const hash = encodeConfigHash(config)
        expect(hash.startsWith('#config=')).toBe(true)
        expect(decodeConfigHash(hash)).toEqual(config)
    })

    it('survives unicode skin names', () => {
        const unicodeConfig: SkinConfig = {
            ...config,
            meta: { ...config.meta, skinName: 'Dräcula ✦ Theme' },
        }
        const decoded = decodeConfigHash(encodeConfigHash(unicodeConfig))
        expect(decoded?.meta.skinName).toBe('Dräcula ✦ Theme')
    })

    it('returns null for foreign or malformed hashes', () => {
        expect(decodeConfigHash('')).toBeNull()
        expect(decodeConfigHash('#other=1')).toBeNull()
        expect(decodeConfigHash('#config=!!!not-base64!!!')).toBeNull()
        expect(decodeConfigHash(`#config=${btoa('{"meta":{}}')}`)).toBeNull()
    })
})
