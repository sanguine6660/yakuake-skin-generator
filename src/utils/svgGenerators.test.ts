import { describe, it, expect } from 'vitest'
import {
    generateBackgroundCenter,
    generateBackgroundLeft,
    generateBackgroundRight,
    generateTabPiece,
    generateButtonSvg,
    generateAllAssets,
} from './svgGenerators'
import { createDefaultSkinConfig } from '../constants'
import { warmIconMarkupCache } from './iconRenderer'

const config = createDefaultSkinConfig()

describe('generateBackgroundCenter', () => {
    it('renders a solid rect with the given color', () => {
        const svg = generateBackgroundCenter('#ff0000', 28)
        expect(svg).toContain('width="1"')
        expect(svg).toContain('height="28"')
        expect(svg).toContain('fill="#ff0000"')
    })

    it('adds opacity when translucent', () => {
        expect(generateBackgroundCenter('#ff0000', 28, true)).toContain('opacity="0.85"')
        expect(generateBackgroundCenter('#ff0000', 28, false)).not.toContain('opacity=')
    })
})

describe('generateBackgroundLeft', () => {
    it('produces valid arcs when radius exceeds half the piece width', () => {
        const svg = generateBackgroundLeft('#000000', 28, 6)
        expect(svg).toContain('A6,6')
        expect(svg).toContain('H6 ')
    })

    it('falls back to a plain rect when radius is 0', () => {
        const svg = generateBackgroundLeft('#000000', 28, 0)
        expect(svg).toContain('<rect')
        expect(svg).not.toContain('<path')
    })
})

describe('generateBackgroundRight', () => {
    it('mirrors the left piece with clamped radius', () => {
        const svg = generateBackgroundRight('#000000', 28, 6)
        expect(svg).toContain('A6,6')
        expect(svg).not.toContain('<rect')
    })

    it('falls back to a plain rect when radius is 0', () => {
        expect(generateBackgroundRight('#000000', 28, 0)).toContain('<rect')
    })
})

describe('generateTabPiece', () => {
    it('renders middles as plain rects', () => {
        const svg = generateTabPiece('#123456', 104, 28, 6, false, true)
        expect(svg).toContain('<rect')
        expect(svg).toContain('fill="#123456"')
    })

    it('clamps radius to the piece width for left pieces', () => {
        const svg = generateTabPiece('#123456', 8, 28, 10, true, false)
        expect(svg).toContain('A8,8')
    })

    it('clamps radius to the piece width for right pieces', () => {
        const svg = generateTabPiece('#123456', 8, 28, 10, false, false)
        expect(svg).toContain('A8,8')
    })

    it('renders plain rects when radius is 0', () => {
        expect(generateTabPiece('#123456', 8, 28, 0, true, false)).toContain('<rect')
        expect(generateTabPiece('#123456', 8, 28, 0, false, false)).toContain('<rect')
    })
})

describe('generateButtonSvg', () => {
    it('embeds provided icon markup and replaces currentColor', () => {
        const svg = generateButtonSvg(
            '<g stroke="currentColor"><path d="M0 0"/></g>',
            '#111111',
            '#ffcc00',
            20,
            14,
            true,
            'settings'
        )
        expect(svg).toContain('stroke="#ffcc00"')
        expect(svg).not.toContain('currentColor')
        expect(svg).toContain('fill="#111111"')
    })

    it('falls back to the built-in icon when markup is null', () => {
        const svg = generateButtonSvg(null, '#111111', '#ffcc00', 20, 14, true, 'settings')
        expect(svg).toContain('d="M12 15a3 3 0 1 0 0-6')
    })

    it('uses a rect background when not circular', () => {
        const svg = generateButtonSvg(null, '#111111', '#ffcc00', 16, 12, false, 'x')
        expect(svg).toContain('<rect width="16"')
        expect(svg).not.toContain('<circle')
    })
})

describe('generateAllAssets', () => {
    const assets = generateAllAssets(config)

    it('generates the logo', () => {
        expect(assets['logo.svg']).toBeTruthy()
    })

    it('generates all title bar assets', () => {
        for (const name of ['background_center', 'background_left', 'background_right']) {
            expect(assets[`title/${name}.svg`]).toBeTruthy()
        }
        for (const button of ['config', 'focus', 'quit']) {
            for (const state of ['up', 'over', 'down']) {
                expect(assets[`title/${button}_${state}.svg`]).toBeTruthy()
            }
        }
    })

    it('generates all tab bar assets', () => {
        for (const name of ['background_center', 'background_left', 'background_right']) {
            expect(assets[`tabs/${name}.svg`]).toBeTruthy()
        }
        for (const piece of ['tab_selected', 'tab_unselected']) {
            for (const part of ['left', 'middle', 'right']) {
                expect(assets[`tabs/${piece}_${part}.svg`]).toBeTruthy()
            }
        }
        for (const button of ['plus', 'minus', 'close']) {
            for (const state of ['up', 'over', 'down']) {
                expect(assets[`tabs/${button}_${state}.svg`]).toBeTruthy()
            }
        }
        expect(assets['tabs/tab_separator.svg']).toBeTruthy()
        expect(assets['tabs/lock.svg']).toBeTruthy()
    })

    it('produces different button icons per icon library', () => {
        const otherLibrary = {
            ...config,
            global: {
                ...config.global,
                iconLibrary: 'md' as const,
                iconSet: {
                    settings: 'MdSettings',
                    maximize: 'MdFullscreen',
                    close: 'MdClose',
                    plus: 'MdAdd',
                    minus: 'MdRemove',
                    lock: 'MdLock',
                },
            },
        }
        for (const role of ['settings', 'maximize', 'close', 'plus', 'minus', 'lock'] as const) {
            warmIconMarkupCache(config, config.global.iconSet[role])
            warmIconMarkupCache(otherLibrary, otherLibrary.global.iconSet[role])
        }
        const otherAssets = generateAllAssets(otherLibrary)
        expect(otherAssets['title/config_up.svg']).not.toBe(assets['title/config_up.svg'])
        expect(otherAssets['tabs/plus_up.svg']).not.toBe(assets['tabs/plus_up.svg'])
    })
})
