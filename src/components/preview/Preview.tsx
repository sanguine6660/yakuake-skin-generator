/**
 * @file src/components/preview/Preview.tsx
 * @description WYSIWYG live preview rendering the actual generated skin assets with interactive button and tab states
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

import { useEffect, useMemo, useState } from 'preact/hooks'
import type { RgbColor, SkinConfig } from '../../types'
import { generateAllAssets } from '../../utils/svgGenerators'
import { deriveKonsoleBackground } from '../../utils/colors'
import { warmIconMarkupCache } from '../../utils/iconRenderer'

interface PreviewProps {
    config: SkinConfig
}

type ButtonState = 'over' | 'down'

const DEMO_TABS = ['Shell', 'htop', 'vim']
const TAB_FONT = '13px system-ui, sans-serif'

let measureCanvas: HTMLCanvasElement | null = null

const getTextWidth = (text: string, bold: boolean): number => {
    if (!measureCanvas) measureCanvas = document.createElement('canvas')
    const ctx = measureCanvas.getContext('2d')
    if (!ctx) return text.length * 7
    ctx.font = `${bold ? 'bold ' : ''}${TAB_FONT}`
    return ctx.measureText(text).width
}

const toDataUri = (svg: string): string => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

const rgb = (color: RgbColor): string => `rgb(${color.r}, ${color.g}, ${color.b})`

export const Preview = ({ config }: PreviewProps) => {
    const { global, title, tabs } = config

    const konsoleBackground =
        global.colors.konsoleBackground ?? deriveKonsoleBackground(global.colors.bg)

    const [buttonStates, setButtonStates] = useState<Record<string, ButtonState | undefined>>({})
    const [selectedTab, setSelectedTab] = useState(0)
    const [iconMarkupVersion, setIconMarkupVersion] = useState(0)

    const uris = useMemo(() => {
        const assets = generateAllAssets(config)
        const map: Record<string, string> = {}
        for (const [name, svg] of Object.entries(assets)) map[name] = toDataUri(svg)
        return map
    }, [config, iconMarkupVersion])

    useEffect(() => {
        let cancelled = false
        const warm = async () => {
            let warmed = false
            for (const role of [
                'settings',
                'maximize',
                'close',
                'plus',
                'minus',
                'lock',
            ] as const) {
                if (await warmIconMarkupCache(config, config.global.iconSet[role])) warmed = true
            }
            if (warmed && !cancelled) setIconMarkupVersion((version) => version + 1)
        }
        void warm()
        return () => {
            cancelled = true
        }
    }, [config])

    const getButtonSrc = (assetBase: string): string => {
        const state = buttonStates[assetBase] ?? 'up'
        return uris[`${assetBase}_${state}.svg`] ?? ''
    }

    const bindButton = (assetBase: string) => ({
        onMouseEnter: () => setButtonStates((prev) => ({ ...prev, [assetBase]: 'over' })),
        onMouseLeave: () => setButtonStates((prev) => ({ ...prev, [assetBase]: undefined })),
        onMouseDown: () => setButtonStates((prev) => ({ ...prev, [assetBase]: 'down' })),
        onMouseUp: () => setButtonStates((prev) => ({ ...prev, [assetBase]: 'over' })),
    })

    const tiledBackground = (assetName: string): preact.JSX.CSSProperties => ({
        backgroundImage: `url("${uris[assetName]}")`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'auto 100%',
    })

    return (
        <div className="rounded-xl border border-[#1e293b] bg-[#121824] p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-200">Live Preview</h2>

            <div
                className="mx-auto max-w-md overflow-hidden rounded bg-[#090d16] shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
                style={{
                    border:
                        title.borderWidth > 0
                            ? `${title.borderWidth}px solid rgb(${title.borderColor.r}, ${title.borderColor.g}, ${title.borderColor.b})`
                            : 'none',
                }}
            >
                <div
                    className="relative w-full px-4"
                    style={{ backgroundColor: konsoleBackground, height: 132 }}
                >
                    <div className="flex h-full flex-col justify-center gap-1 font-mono text-[11px] leading-relaxed">
                        <p className="m-0" style={{ color: rgb(tabs.selectedColor) }}>
                            <span style={{ color: rgb(title.textColor), fontWeight: 'bold' }}>
                                ❯{' '}
                            </span>
                            generate-skin --name "{title.textContent}"
                        </p>
                        <p className="m-0" style={{ color: global.colors.dim }}>
                            ✓ skin files generated successfully
                        </p>
                        <p className="m-0" style={{ color: rgb(tabs.selectedColor) }}>
                            <span style={{ color: rgb(title.textColor), fontWeight: 'bold' }}>
                                ❯{' '}
                            </span>
                            <span
                                className="inline-block h-2.75 w-1.75 animate-pulse align-middle"
                                style={{ backgroundColor: rgb(title.textColor) }}
                            />
                        </p>
                    </div>
                </div>

                <div
                    className="relative h-7 w-full overflow-hidden"
                    style={{ backgroundColor: global.colors.bg }}
                >
                    <div
                        className="absolute inset-y-0"
                        style={{
                            ...tiledBackground('tabs/background_center.svg'),
                            left: 8,
                            right: 8,
                        }}
                    />
                    <img
                        src={uris['tabs/background_left.svg']}
                        alt=""
                        className="absolute top-0 left-0 h-full w-auto"
                    />
                    <img
                        src={uris['tabs/background_right.svg']}
                        alt=""
                        className="absolute top-0 right-0 h-full w-auto"
                    />

                    {tabs.tabsEnabled && (
                        <>
                            <img
                                src={getButtonSrc('tabs/plus')}
                                alt="New Tab"
                                title="New Tab"
                                className="absolute cursor-pointer"
                                style={{ left: tabs.plusBtn.x, top: tabs.plusBtn.y }}
                                {...bindButton('tabs/plus')}
                            />
                            <img
                                src={getButtonSrc('tabs/minus')}
                                alt="Close Session"
                                title="Close Session"
                                className="absolute cursor-pointer"
                                style={{ right: tabs.minusBtn.x, top: tabs.minusBtn.y }}
                                {...bindButton('tabs/minus')}
                            />

                            <div
                                className="absolute top-0 flex h-full items-stretch"
                                style={{ left: tabs.tabsX }}
                            >
                                {DEMO_TABS.map((label, index) => {
                                    const isSelected = index === selectedTab
                                    const isNextToSelected =
                                        index === selectedTab + 1 || index === selectedTab - 1
                                    const bold = isSelected && (tabs.selectedTextBold ?? true)
                                    const textWidth = getTextWidth(label, bold) + 10
                                    const pieceSet = isSelected ? 'tab_selected' : 'tab_unselected'
                                    const hasCorners =
                                        isSelected ||
                                        (uris[`tabs/${pieceSet}_left.svg`] !== undefined &&
                                            tabs.unselectedLeft !== undefined)

                                    return (
                                        <div
                                            key={label}
                                            className="relative flex h-full cursor-pointer items-stretch"
                                            onClick={() => setSelectedTab(index)}
                                        >
                                            {!isSelected &&
                                                !tabs.unselectedLeft &&
                                                !isNextToSelected && (
                                                    <img
                                                        src={uris['tabs/tab_separator.svg']}
                                                        alt=""
                                                        className="h-full w-auto"
                                                    />
                                                )}
                                            {hasCorners ? (
                                                <>
                                                    <img
                                                        src={uris[`tabs/${pieceSet}_left.svg`]}
                                                        alt=""
                                                        className="h-full w-auto"
                                                    />
                                                    <div
                                                        className="h-full"
                                                        style={{
                                                            ...tiledBackground(
                                                                `tabs/${pieceSet}_middle.svg`
                                                            ),
                                                            width: textWidth,
                                                        }}
                                                    />
                                                    <img
                                                        src={uris[`tabs/${pieceSet}_right.svg`]}
                                                        alt=""
                                                        className="h-full w-auto"
                                                    />
                                                </>
                                            ) : (
                                                <div
                                                    className="h-full"
                                                    style={{
                                                        ...tiledBackground(
                                                            `tabs/${pieceSet}_middle.svg`
                                                        ),
                                                        width: textWidth,
                                                    }}
                                                />
                                            )}
                                            <span
                                                className="absolute flex items-center justify-center"
                                                style={{
                                                    top: 0,
                                                    height: '100%',
                                                    left: 8,
                                                    width: textWidth,
                                                    color: rgb(tabs.selectedColor),
                                                    fontWeight: bold ? 'bold' : 'normal',
                                                    fontSize: '13px',
                                                    fontFamily: 'system-ui, sans-serif',
                                                }}
                                            >
                                                {label}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </div>

                <div
                    className="relative h-7 w-full overflow-hidden"
                    style={{
                        backgroundColor: global.colors.bg,
                        borderTop:
                            title.borderWidth > 0
                                ? `${title.borderWidth}px solid rgb(${title.borderColor.r}, ${title.borderColor.g}, ${title.borderColor.b})`
                                : 'none',
                    }}
                >
                    <div
                        className="absolute inset-y-0"
                        style={{
                            ...tiledBackground('title/background_center.svg'),
                            left: 8,
                            right: 8,
                        }}
                    />
                    <img
                        src={uris['title/background_left.svg']}
                        alt=""
                        className="absolute top-0 left-0 h-full w-auto"
                    />
                    <img
                        src={uris['title/background_right.svg']}
                        alt=""
                        className="absolute top-0 right-0 h-full w-auto"
                    />

                    <span
                        className="absolute top-0 h-7 whitespace-nowrap"
                        style={{
                            ...(title.centered
                                ? { left: '50%', translate: '-50% 0' }
                                : { left: title.textX }),
                            fontSize: '13px',
                            fontFamily: 'system-ui, sans-serif',
                            lineHeight: '28px',
                            transform: `translateY(${title.textY - 18}px)`,
                            color: rgb(title.textColor),
                            fontWeight: title.textBold ? 'bold' : 'normal',
                        }}
                    >
                        {`ysg : ~bash - ${title.textContent}`}
                    </span>

                    {title.titleEnabled && (
                        <>
                            <img
                                src={getButtonSrc('title/quit')}
                                alt="Quit"
                                title="Quit"
                                className="absolute cursor-pointer"
                                style={{
                                    ...(title.quitBtn.anchor === 'left'
                                        ? { left: title.quitBtn.x }
                                        : { right: title.quitBtn.x }),
                                    top: title.quitBtn.y,
                                }}
                                {...bindButton('title/quit')}
                            />
                            <img
                                src={getButtonSrc('title/config')}
                                alt="Menu"
                                title="Menu"
                                className="absolute cursor-pointer"
                                style={{
                                    ...(title.configBtn.anchor === 'left'
                                        ? { left: title.configBtn.x }
                                        : { right: title.configBtn.x }),
                                    top: title.configBtn.y,
                                }}
                                {...bindButton('title/config')}
                            />
                            <img
                                src={getButtonSrc('title/focus')}
                                alt="Keep Window Open"
                                title="Keep window open when it loses focus"
                                className="absolute cursor-pointer"
                                style={{
                                    ...(title.focusBtn.anchor === 'left'
                                        ? { left: title.focusBtn.x }
                                        : { right: title.focusBtn.x }),
                                    top: title.focusBtn.y,
                                }}
                                {...bindButton('title/focus')}
                            />
                        </>
                    )}
                </div>
            </div>

            <div className="mt-4 rounded-lg border border-[#1e293b] bg-[#090d16] p-3 text-xs text-gray-400">
                <p>
                    True WYSIWYG preview using the actual generated skin assets — hover buttons for
                    hover/pressed states, click tabs to switch the selection.
                </p>
            </div>
        </div>
    )
}
