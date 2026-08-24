import { describe, it, expect } from 'vitest'
import { generateTitleSkin, generateTabsSkin, prepareSkinFiles } from './skinFileGenerator'
import { createDefaultSkinConfig } from '../constants'
import type { SkinConfig } from '../types'

const config = createDefaultSkinConfig()

describe('generateTitleSkin', () => {
    it('writes the metadata section', () => {
        const skin = generateTitleSkin(config)
        expect(skin).toContain('[Description]')
        expect(skin).toContain(`Skin=${config.meta.skinName}`)
        expect(skin).toContain(`Author=${config.meta.author}`)
        expect(skin).toContain(`Email=${config.meta.email}`)
        expect(skin).toContain('Icon=/logo.svg')
    })

    it('writes the title text color as separate RGB keys', () => {
        const skin = generateTitleSkin(config)
        expect(skin).toContain('[Text]')
        expect(skin).toContain(`red=${config.title.textColor.r}`)
        expect(skin).toContain(`green=${config.title.textColor.g}`)
        expect(skin).toContain(`blue=${config.title.textColor.b}`)
    })

    it('omits buttons when the title bar is disabled', () => {
        const skin = generateTitleSkin({
            ...config,
            title: { ...config.title, titleEnabled: false },
        })
        expect(skin).not.toContain('[FocusButton]')
        expect(skin).not.toContain('[ConfigButton]')
        expect(skin).not.toContain('[QuitButton]')
    })
})

describe('generateTabsSkin', () => {
    it('writes the tab text color as RGB keys inside [Tabs]', () => {
        const skin = generateTabsSkin(config)
        expect(skin).toContain('[Tabs]')
        expect(skin).toContain(`red=${config.tabs.selectedColor.r}`)
        expect(skin).toContain(`green=${config.tabs.selectedColor.g}`)
        expect(skin).toContain(`blue=${config.tabs.selectedColor.b}`)
        expect(skin).not.toContain('selected_color=')
        expect(skin).not.toContain('unselected_color=')
    })

    it('maps the three-piece config onto the real background/corner keys', () => {
        const skin = generateTabsSkin(config)
        expect(skin).toContain(`selected_background=${config.tabs.selectedMiddle}`)
        expect(skin).toContain(`unselected_background=${config.tabs.unselectedMiddle}`)
        expect(skin).toContain(`selected_left_corner=${config.tabs.selectedLeft}`)
        expect(skin).toContain(`selected_right_corner=${config.tabs.selectedRight}`)
        expect(skin).toContain(`unselected_left_corner=${config.tabs.unselectedLeft}`)
        expect(skin).toContain(`unselected_right_corner=${config.tabs.unselectedRight}`)
    })

    it('omits prevent_closing entries when the lock button is disabled', () => {
        const skin = generateTabsSkin({
            ...config,
            tabs: {
                ...config.tabs,
                lockBtn: { ...config.tabs.lockBtn, enabled: false },
            },
        })
        expect(skin).not.toContain('prevent_closing_image=')
    })

    it('omits the separator when none is configured', () => {
        const skin = generateTabsSkin({
            ...config,
            tabs: { ...config.tabs, separatorImage: undefined },
        })
        expect(skin).not.toContain('separator_image=')
    })

    it('never writes button groups that Yakuake does not parse', () => {
        const skin = generateTabsSkin(config)
        expect(skin).not.toContain('[LockButton]')
    })

    it('omits buttons when the tab bar is disabled', () => {
        const skin = generateTabsSkin({
            ...config,
            tabs: { ...config.tabs, tabsEnabled: false },
        })
        expect(skin).not.toContain('[PlusButton]')
        expect(skin).not.toContain('[MinusButton]')
        expect(skin).not.toContain('[Background]')
    })
})

describe('prepareSkinFiles', () => {
    it('sanitizes the folder name', () => {
        const { folderName } = prepareSkinFiles({
            ...config,
            meta: { ...config.meta, skinName: 'My Cool Skin! 2.0' },
        })
        expect(folderName).toBe('my_cool_skin__2_0')
    })

    it('includes the required root files', () => {
        const { files } = prepareSkinFiles(config)
        const paths = files.map((file) => file.path)
        expect(paths).toContain('my_custom_skin/logo.svg')
        expect(paths).toContain('my_custom_skin/title.skin')
        expect(paths).toContain('my_custom_skin/tabs.skin')
    })

    it('only references files that exist in the archive', () => {
        const { files } = prepareSkinFiles(config)
        const archiveFiles = new Set(files.map((file) => file.path))
        const referenced: string[] = []

        for (const file of files) {
            if (!file.path.endsWith('.skin')) continue
            const content = new TextDecoder().decode(file.content)
            for (const match of content.matchAll(/=(\/[\w./-]+\.(?:svg|png))$/gm)) {
                referenced.push(file.path.split('/')[0] + match[1])
            }
        }

        expect(referenced.length).toBeGreaterThan(0)
        for (const reference of referenced) {
            expect(archiveFiles).toContain(reference)
        }
    })

    it('encodes file contents as Uint8Array', () => {
        const { files } = prepareSkinFiles(config)
        for (const file of files) {
            expect(file.content).toBeInstanceOf(Uint8Array)
        }
    })

    it('reflects preset palette changes in the exported text colors', () => {
        const draculaConfig: SkinConfig = {
            ...config,
            title: { ...config.title, textColor: { r: 189, g: 147, b: 249 } },
            tabs: { ...config.tabs, selectedColor: { r: 189, g: 147, b: 249 } },
        }
        const titleSkin = generateTitleSkin(draculaConfig)
        const tabsSkin = generateTabsSkin(draculaConfig)
        expect(titleSkin).toContain('red=189')
        expect(tabsSkin).toContain('red=189')
    })
})
