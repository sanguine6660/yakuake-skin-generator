/**
 * @file src/utils/skinFolderImporter.test.ts
 * @description Tests for reverse-engineering skin folders back into editor
 * configurations, including a full generate → strip → import round-trip.
 *
 * @copyright Copyright (C) 2026 sanguine6660
 * @since 1.1.0
 * @license GPL-3.0-or-later
 */

import { beforeAll, describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import {
    firstSvgFillHex,
    importSkinFolder,
    parseButtonSvg,
    parseSkinIni,
    relativizePaths,
    svgArcRadius,
} from './skinFolderImporter'
import { prepareSkinFiles } from './skinFileGenerator'
import { getIconMarkup, warmIconMarkupCache } from './iconRenderer'
import type { SkinConfig } from '../types'

const REPO_ROOT = path.resolve(__dirname, '..', '..')
const FIXTURE_PATH = path.join(REPO_ROOT, 'src-tauri', 'tests', 'fixtures', 'config.json')
const fixtureConfig = JSON.parse(readFileSync(FIXTURE_PATH, 'utf-8')) as SkinConfig

const encode = (text: string): Uint8Array => new TextEncoder().encode(text)

// Mirrors the real export flow (useSkinExport warms the cache first) so that
// metadata.json embeds icon markup.
const warmFixtureIcons = async () => {
    for (const role of ['settings', 'maximize', 'close', 'plus', 'minus', 'lock'] as const) {
        await warmIconMarkupCache(fixtureConfig, fixtureConfig.global.iconSet[role])
    }
}

const buildFolder = async (config: SkinConfig, withMetadata: boolean) => {
    await warmFixtureIcons()
    const { files } = prepareSkinFiles(config)
    return files
        .filter((f) => withMetadata || f.path !== `${'parity_skin'}/metadata.json`)
        .map((f) => ({ path: f.path, content: f.content }))
}

describe('parseSkinIni', () => {
    it('parses sections and key/value pairs', () => {
        const ini = parseSkinIni(
            ['[Description]', 'Skin=My Skin', 'Author=me', '', '[Text]', 'x=14', 'bold=true'].join(
                '\n'
            )
        )
        expect(ini.Description).toEqual({ Skin: 'My Skin', Author: 'me' })
        expect(ini.Text).toEqual({ x: '14', bold: 'true' })
    })

    it('handles CRLF line endings and BOM', () => {
        const ini = parseSkinIni('\uFEFF[Border]\r\nred=10\r\nwidth=2\r\n')
        expect(ini.Border).toEqual({ red: '10', width: '2' })
    })

    it('ignores junk lines while keeping values containing equals signs', () => {
        const ini = parseSkinIni('garbage\n[Text]\ntext=a=b=c\nnovalue\n=x\n')
        expect(ini.Text).toEqual({ text: 'a=b=c' })
        expect(Object.keys(ini)).toEqual(['Text'])
    })
})

describe('SVG sampling helpers', () => {
    it('extracts the first hex fill', () => {
        expect(firstSvgFillHex('<rect fill="#AABBCC"/><rect fill="#111111"/>')).toBe('#aabbcc')
        expect(firstSvgFillHex('<rect fill="red"/>')).toBeNull()
    })

    it('recovers border radius from corner arcs', () => {
        expect(svgArcRadius('<path d="M8,0 V28 H5 A5,5 0 0,1 0,23"/>')).toBe(5)
        expect(svgArcRadius('<rect width="8" height="28"/>')).toBeNull()
    })

    it('parses button SVGs into bg/icon/markup with currentColor restored', () => {
        const parsed = parseButtonSvg(
            '<svg><circle cx="10" cy="10" r="9" fill="#1f2937"/><g transform="translate(3, 3)" stroke="#66c2f2" fill="none"><path d="M15 3h6v6"/></g></svg>'
        )
        expect(parsed.bg).toBe('#1f2937')
        expect(parsed.icon).toBe('#66c2f2')
        expect(parsed.markup).toContain('currentColor')
        expect(parsed.markup).not.toContain('#66c2f2')
    })
})

describe('relativizePaths', () => {
    it('strips arbitrary nesting above the skin root', () => {
        const map = relativizePaths([
            'Downloads/skins/MySkin/title.skin',
            'Downloads/skins/MySkin/title/focus_up.svg',
            'metadata.json',
        ])
        expect(map.get('Downloads/skins/MySkin/title.skin')).toBe('title.skin')
        expect(map.get('Downloads/skins/MySkin/title/focus_up.svg')).toBe('title/focus_up.svg')
        expect(map.get('metadata.json')).toBe('metadata.json')
    })

    it('handles backslash separators', () => {
        const map = relativizePaths(['C:\\skins\\X\\tabs.skin'])
        expect(map.get('C:\\skins\\X\\tabs.skin')).toBe('tabs.skin')
    })
})

describe('importSkinFolder — exact fidelity via metadata.json', () => {
    it('restores the full configuration of generator-produced skins', async () => {
        const folder = await buildFolder(fixtureConfig, true)
        const { config, fidelity, warnings } = importSkinFolder(folder)

        expect(fidelity).toBe('exact')
        expect(warnings).toHaveLength(0)
        expect(config.meta).toEqual(fixtureConfig.meta)
        expect(config.global.colors).toEqual(fixtureConfig.global.colors)
        expect(config.title.focusBtn).toEqual(fixtureConfig.title.focusBtn)
        expect(config.tabs.closeBtn).toEqual(fixtureConfig.tabs.closeBtn)
        expect(config.global.borderRadius).toBe(fixtureConfig.global.borderRadius)
    })

    it('rehydrates embedded icon markup into the cache', async () => {
        importSkinFolder(await buildFolder(fixtureConfig, true))
        const markup = getIconMarkup(fixtureConfig, fixtureConfig.global.iconSet.maximize)
        expect(markup).toBeTruthy()
        expect(markup).toContain('currentColor')
    })
})

describe('importSkinFolder — reconstruction from INI + assets', () => {
    let imported: ReturnType<typeof importSkinFolder>
    beforeAll(async () => {
        imported = importSkinFolder(await buildFolder(fixtureConfig, false))
    })

    it('reports reconstructed fidelity with guidance warnings', () => {
        expect(imported.fidelity).toBe('reconstructed')
        expect(imported.warnings.length).toBeGreaterThan(0)
    })

    it('recovers metadata from title.skin Description', () => {
        expect(imported.config.meta.skinName).toBe('Parity Skin')
        expect(imported.config.meta.author).toBe('sanguine6660')
        expect(imported.config.meta.web).toBe('https://example.com/parity')
    })

    it('samples the global palette from generated assets', () => {
        expect(imported.config.global.colors.bg).toBe('#1e2233')
        expect(imported.config.global.colors.selected).toBe('#3b4252')
        expect(imported.config.global.colors.dim).toBe('#232834')
        expect(imported.config.global.colors.text).toBe('#66c2f2')
    })

    it('recovers border radius and per-bar translucency', () => {
        expect(imported.config.global.borderRadius).toBe(5)
        expect(imported.config.title.bgTranslucent).toBe(false)
        expect(imported.config.tabs.bgTranslucent).toBe(true)
    })

    it('restores button geometry, image paths and enabled state', () => {
        expect(imported.config.title.focusBtn).toMatchObject({
            enabled: true,
            x: 90,
            y: 5,
            up: '/title/focus_up.svg',
            down: '/title/focus_down.svg',
        })
        expect(imported.config.tabs.plusBtn.enabled).toBe(true)
        expect(imported.config.title.titleEnabled).toBe(true)
        expect(imported.config.tabs.tabsEnabled).toBe(true)
        expect(imported.config.tabs.lockEnabled).toBe(true)
        expect(imported.config.tabs.separatorImage).toBe('/tabs/tab_separator.svg')
    })

    it('samples button state colors and reuses original icon artwork', () => {
        expect(imported.config.global.buttonColors.quit.upBg).toBe('#1f2937')
        expect(imported.config.global.buttonColors.quit.upIcon).toBe('#f87171')
        expect(imported.config.global.buttonColors.quit.overIcon).toBe('#fca5a5')

        const markup = getIconMarkup(imported.config, imported.config.global.iconSet.maximize)
        expect(markup).toBeTruthy()
        expect(markup).toContain('stroke="currentColor"')
    })

    it('derives the unselected tab color from assets', () => {
        expect(imported.config.tabs.unselectedColor).toEqual({ r: 35, g: 40, b: 52 })
    })
})

describe('importSkinFolder — error handling', () => {
    it('rejects empty selections', () => {
        expect(() => importSkinFolder([])).toThrow('empty')
    })

    it('requires title.skin', () => {
        expect(() =>
            importSkinFolder([{ path: 'SomeSkin/logo.svg', content: encode('<svg/>') }])
        ).toThrow(/title\.skin/)
    })

    it('falls back to reconstruction when metadata.json is corrupt', async () => {
        const folder = (await buildFolder(fixtureConfig, false)).concat({
            path: 'parity_skin/metadata.json',
            content: encode('{ not json'),
        })
        const result = importSkinFolder(folder)
        expect(result.fidelity).toBe('reconstructed')
    })

    it('derives the skin name from the folder when Description lacks one', () => {
        const minimal = [{ path: 'Cool_Skin/title.skin', content: encode('[Border]\nwidth=0\n') }]
        const result = importSkinFolder(minimal)
        expect(result.config.meta.skinName).toBe('Cool Skin')
    })
})
