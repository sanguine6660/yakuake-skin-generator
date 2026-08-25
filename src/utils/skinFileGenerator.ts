/**
 * @file src/utils/skinFileGenerator.ts
 * @description Generates .skin INI configuration files and prepares all assets for tar.gz creation
 * @copyright Copyright (C) 2026 sanguine6660
 * @since 1.0.0
 * @license GPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import type { SkinConfig } from '../types'
import { generateAllAssets } from './svgGenerators'
import { getIconMarkup } from './iconRenderer'

const GENERATOR_NAME = 'Yakuake Skin Generator'
const GENERATOR_URL = 'https://github.com/sanguine6660/yakuake-skin-generator'

export const generateLicense = (config: SkinConfig): string => {
    const { skinName, author } = config.meta
    return `Skin Name: ${skinName}
Author: ${author}
Repository / Source Code: ${GENERATOR_URL}
Created with: ${GENERATOR_NAME} (${GENERATOR_URL})


License: Creative Commons Attribution 4.0 International (CC BY 4.0)


You are free to use, share, and adapt this skin for any purpose,
provided that you keep this copyright notice, attribute the original creator,
and do not claim ownership of the original creation.
`
}

export const generateSkinReadme = (config: SkinConfig): string => {
    const { skinName, author } = config.meta
    return `# ${skinName} (Yakuake Skin)

This skin was custom-generated using the **${GENERATOR_NAME}**.

## Credits & Links
* **Original Creator:** ${author}
* **Source Code & Editor:** [GitHub Repository](${GENERATOR_URL})
* **License:** CC BY 4.0

---

## About the Generator & How to Use
Want to modify this skin, tweak its colors, swap icon sets, or design your own from scratch?

1. Visit the online editor or clone the source repository:
   👉 **[sanguine6660/yakuake-skin-generator](${GENERATOR_URL})**
2. Import this skin's JSON configuration file into the editor, or tweak the live parameters visually.
3. Export a fresh \`.tar.gz\` bundle instantly!

## Installation
Extract this folder into your local Yakuake/KDE themes directory (usually \`~/.local/share/yakuake/skins/\` or system-wide equivalent), then select it from your Yakuake appearance settings.
`
}

export const generateMetadata = (config: SkinConfig): string => {
    const icons: Record<string, string> = {}
    for (const role of ['settings', 'maximize', 'close', 'plus', 'minus', 'lock'] as const) {
        const markup = getIconMarkup(config, config.global.iconSet[role])
        if (markup) icons[role] = markup
    }

    const metadata = {
        generator: {
            name: GENERATOR_NAME,
            url: GENERATOR_URL,
            version: __APP_VERSION__,
        },
        skin: {
            name: config.meta.skinName,
            author: config.meta.author,
            email: config.meta.email,
            web: config.meta.web,
            icon: config.meta.icon,
            license: 'CC-BY-4.0',
            licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
            repository: GENERATOR_URL,
        },
        config: {
            note: 'Full skin configuration state for re-importing into the editor',
            data: {
                global: config.global,
                title: config.title,
                tabs: config.tabs,
            },
            icons,
        },
    }
    return JSON.stringify(metadata, null, 4)
}

const writeButtonConfig = (
    prefix: string,
    btn: { enabled: boolean; x: number; y: number; up: string; over: string; down: string }
): string[] => {
    if (!btn.enabled) return []
    return [
        '',
        `[${prefix}Button]`,
        `x=${btn.x}`,
        `y=${btn.y}`,
        `up_image=${btn.up}`,
        `over_image=${btn.over}`,
        `down_image=${btn.down}`,
    ]
}

export const generateTitleSkin = (config: SkinConfig): string => {
    const { meta, title } = config
    const borderColor = title.borderColor
    const textColor = title.textColor

    const lines = [
        '[Description]',
        `Skin=${meta.skinName}`,
        `Author=${meta.author}`,
        `Email=${meta.email}`,
        meta.web ? `Web=${meta.web}` : '',
        `Icon=/logo.svg`,
        '',
        '[Border]',
        `red=${borderColor.r}`,
        `green=${borderColor.g}`,
        `blue=${borderColor.b}`,
        `width=${title.borderWidth}`,
        '',
        '[Text]',
        `x=${title.textX}`,
        `y=${title.textY}`,
        `red=${textColor.r}`,
        `green=${textColor.g}`,
        `blue=${textColor.b}`,
        `text=${title.textContent}`,
        `bold=${title.textBold ? 'true' : 'false'}`,
        '',
        '[Background]',
        `back_image=${title.bgCenter}`,
        `left_corner=${title.bgLeft}`,
        `right_corner=${title.bgRight}`,
    ]

    if (title.titleEnabled) {
        lines.push(...writeButtonConfig('Focus', title.focusBtn))
        lines.push(...writeButtonConfig('Config', title.configBtn))
        lines.push(...writeButtonConfig('Quit', title.quitBtn))
    }

    return lines.filter(Boolean).join('\n')
}

export const generateTabsSkin = (config: SkinConfig): string => {
    const { meta, tabs } = config
    const textColor = tabs.selectedColor

    const lines = [
        '[Description]',
        `Skin=${meta.skinName}`,
        `Author=${meta.author}`,
        `Email=${meta.email}`,
        meta.web ? `Web=${meta.web}` : '',
        `Icon=/logo.svg`,
        '',
        '[Tabs]',
        `x=${tabs.tabsX}`,
        `y=${tabs.tabsY}`,
        `red=${textColor.r}`,
        `green=${textColor.g}`,
        `blue=${textColor.b}`,
        tabs.separatorImage ? `separator_image=${tabs.separatorImage}` : '',
        `selected_background=${tabs.selectedMiddle}`,
        `selected_left_corner=${tabs.selectedLeft}`,
        `selected_right_corner=${tabs.selectedRight}`,
        `unselected_background=${tabs.unselectedMiddle}`,
        `unselected_left_corner=${tabs.unselectedLeft}`,
        `unselected_right_corner=${tabs.unselectedRight}`,
    ]

    if (tabs.tabsEnabled && tabs.lockEnabled && tabs.lockBtn.enabled) {
        lines.push(
            `prevent_closing_image=${tabs.preventClosingImage}`,
            `prevent_closing_image_x=${tabs.lockBtn.x}`,
            `prevent_closing_image_y=${tabs.lockBtn.y}`
        )
    }

    if (tabs.tabsEnabled) {
        lines.push(
            '',
            '[Background]',
            `back_image=${tabs.bgCenter}`,
            `left_corner=${tabs.bgLeft}`,
            `right_corner=${tabs.bgRight}`
        )

        if (tabs.plusBtn.enabled) {
            lines.push(...writeButtonConfig('Plus', tabs.plusBtn))
        }
        if (tabs.minusBtn.enabled) {
            lines.push(...writeButtonConfig('Minus', tabs.minusBtn))
        }
        if (tabs.closeBtn.enabled) {
            lines.push(...writeButtonConfig('Close', tabs.closeBtn))
        }
    }

    return lines.filter(Boolean).join('\n')
}

export const prepareSkinFiles = (config: SkinConfig) => {
    const folderName = config.meta.skinName.toLowerCase().replace(/[^a-z0-9]/g, '_')
    const assets = generateAllAssets(config)

    const files: { path: string; content: Uint8Array }[] = []

    const addFile = (relPath: string, content: string) => {
        files.push({
            path: `${folderName}/${relPath}`,
            content: new TextEncoder().encode(content),
        })
    }

    addFile('logo.svg', assets['logo.svg'])
    addFile('LICENSE', generateLicense(config))
    addFile('README.md', generateSkinReadme(config))
    addFile('metadata.json', generateMetadata(config))
    addFile('title.skin', generateTitleSkin(config))
    addFile('tabs.skin', generateTabsSkin(config))

    for (const [path, content] of Object.entries(assets)) {
        if (!['logo.svg', 'title.skin', 'tabs.skin'].includes(path)) {
            addFile(path, content)
        }
    }

    return { files, folderName }
}
