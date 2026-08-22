import type { SkinConfig } from '../types'
import { generateAllAssets } from './svgGenerators'

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

    if (title.focusBtnEnabled) {
        lines.push(
            '',
            '[FocusButton]',
            `x=${title.focusBtnX}`,
            `y=${title.focusBtnY}`,
            `up_image=${title.focusBtnUp}`,
            `over_image=${title.focusBtnOver}`,
            `down_image=${title.focusBtnDown}`
        )
    }

    if (title.configBtnEnabled) {
        lines.push(
            '',
            '[ConfigButton]',
            `x=${title.configBtnX}`,
            `y=${title.configBtnY}`,
            `up_image=${title.configBtnUp}`,
            `over_image=${title.configBtnOver}`,
            `down_image=${title.configBtnDown}`
        )
    }

    if (title.quitBtnEnabled) {
        lines.push(
            '',
            '[QuitButton]',
            `x=${title.quitBtnX}`,
            `y=${title.quitBtnY}`,
            `up_image=${title.quitBtnUp}`,
            `over_image=${title.quitBtnOver}`,
            `down_image=${title.quitBtnDown}`
        )
    }

    return lines.filter(Boolean).join('\n')
}

export const generateTabsSkin = (config: SkinConfig): string => {
    const { meta, tabs } = config
    const textColor = tabs.tabsTextColor

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
        `selected_background=${tabs.selectedBg}`,
        tabs.selectedLeftCorner ? `selected_left_corner=${tabs.selectedLeftCorner}` : '',
        tabs.selectedRightCorner ? `selected_right_corner=${tabs.selectedRightCorner}` : '',
        `unselected_background=${tabs.unselectedBg}`,
        tabs.unselectedLeftCorner ? `unselected_left_corner=${tabs.unselectedLeftCorner}` : '',
        tabs.unselectedRightCorner ? `unselected_right_corner=${tabs.unselectedRightCorner}` : '',
    ]

    if (tabs.lockEnabled) {
        lines.push(
            `prevent_closing_image=${tabs.lockImage}`,
            `prevent_closing_image_x=${tabs.lockX}`,
            `prevent_closing_image_y=${tabs.lockY}`
        )
    }

    lines.push(
        '',
        '[Background]',
        `back_image=${tabs.bgCenter}`,
        `left_corner=${tabs.bgLeft}`,
        `right_corner=${tabs.bgRight}`
    )

    if (tabs.plusBtnEnabled) {
        lines.push(
            '',
            '[PlusButton]',
            `x=${tabs.plusBtnX}`,
            `y=${tabs.plusBtnY}`,
            `up_image=${tabs.plusBtnUp}`,
            `over_image=${tabs.plusBtnOver}`,
            `down_image=${tabs.plusBtnDown}`
        )
    }

    if (tabs.minusBtnEnabled) {
        lines.push(
            '',
            '[MinusButton]',
            `x=${tabs.minusBtnX}`,
            `y=${tabs.minusBtnY}`,
            `up_image=${tabs.minusBtnUp}`,
            `over_image=${tabs.minusBtnOver}`,
            `down_image=${tabs.minusBtnDown}`
        )
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
    addFile('title.skin', generateTitleSkin(config))
    addFile('tabs.skin', generateTabsSkin(config))

    for (const [path, content] of Object.entries(assets)) {
        if (!['logo.svg', 'title.skin', 'tabs.skin'].includes(path)) {
            addFile(path, content)
        }
    }

    return { files, folderName }
}
