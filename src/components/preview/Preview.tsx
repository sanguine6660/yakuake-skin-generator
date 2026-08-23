import type { SkinConfig } from '../../types'
import { renderIcon } from '../../utils/iconRenderer'

interface PreviewProps {
    config: SkinConfig
}

export const Preview = ({ config }: PreviewProps) => {
    const { global, title, tabs } = config
    const borderColor = `rgb(${title.borderColor.r}, ${title.borderColor.g}, ${title.borderColor.b})`
    const textColor = `rgb(${title.textColor.r}, ${title.textColor.g}, ${title.textColor.b})`
    const selectedTextColor = `rgb(${tabs.selectedColor.r}, ${tabs.selectedColor.g}, ${tabs.selectedColor.b})`
    const unselectedTextColor = `rgb(${tabs.unselectedColor.r}, ${tabs.unselectedColor.g}, ${tabs.unselectedColor.b})`

    return (
        <div className="rounded-xl border border-[#1e293b] bg-[#121824] p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-200">Live Preview</h2>

            <div className="mx-auto max-w-md overflow-hidden rounded-lg border border-[#1e293b] bg-[#090d16]">
                {/* Tabs Bar Preview (TOP in Yakuake) */}
                <div
                    style={{ backgroundColor: global.colors.bg }}
                    className="flex h-[28px] items-center gap-2 border-b border-[#1e293b] px-2"
                >
                    {/* Plus/Minus buttons on left */}
                    <div className="flex items-center gap-1">
                        <div
                            className="flex h-[16px] w-[16px] items-center justify-center"
                            style={{ backgroundColor: global.colors.dim, borderRadius: '3px' }}
                            title="New Tab"
                        >
                            {renderIcon(config, global.iconSet.plus, 10)}
                        </div>
                        <div
                            className="flex h-[16px] w-[16px] items-center justify-center"
                            style={{ backgroundColor: global.colors.dim, borderRadius: '3px' }}
                            title="Close Tab"
                        >
                            {renderIcon(config, global.iconSet.minus, 10)}
                        </div>
                    </div>

                    <div
                        className="h-4 w-[1px]"
                        style={{ backgroundColor: `${global.colors.text}40` }}
                    />

                    {/* Tabs */}
                    <div className="flex flex-1 items-center gap-1 overflow-x-auto">
                        {/* Active tab with lock icon */}
                        <div
                            className="flex min-w-[70px] flex-shrink-0 items-center gap-1.5 px-3 py-1"
                            style={{
                                backgroundColor: global.colors.selected,
                                borderRadius: `${global.borderRadius}px`,
                            }}
                        >
                            {tabs.lockEnabled && (
                                <span
                                    className="flex h-4 w-4 items-center justify-center"
                                    title="Locked"
                                >
                                    {renderIcon(config, global.iconSet.lock, 8)}
                                </span>
                            )}
                            <span
                                style={{
                                    color: selectedTextColor,
                                    fontSize: '10px',
                                    fontWeight: 500,
                                    fontFamily: 'monospace',
                                }}
                            >
                                Shell
                            </span>
                            {tabs.closeBtn.enabled && (
                                <span className="flex h-4 w-4 items-center justify-center ml-1">
                                    {renderIcon(config, global.iconSet.close, 8)}
                                </span>
                            )}
                        </div>
                        <div
                            className="min-w-[55px] flex-shrink-0 px-3 py-1 font-mono text-[10px]"
                            style={{
                                backgroundColor: global.colors.dim,
                                borderRadius: `${global.borderRadius}px`,
                                color: unselectedTextColor,
                            }}
                        >
                            htop
                        </div>
                        <div
                            className="min-w-[55px] flex-shrink-0 px-3 py-1 font-mono text-[10px]"
                            style={{
                                backgroundColor: global.colors.dim,
                                borderRadius: `${global.borderRadius}px`,
                                color: unselectedTextColor,
                            }}
                        >
                            vim
                        </div>
                    </div>
                </div>

                {/* Title Bar Preview (BOTTOM in Yakuake) */}
                <div
                    style={{
                        backgroundColor: global.colors.bg,
                        borderTop:
                            title.borderWidth > 0
                                ? `${title.borderWidth}px solid ${borderColor}`
                                : 'none',
                    }}
                    className="flex h-[28px] items-center justify-between px-3"
                >
                    {/* Left: Title text */}
                    <span
                        style={{
                            color: textColor,
                            fontWeight: title.textBold ? 'bold' : 'normal',
                            fontSize: '11px',
                            fontFamily: 'monospace',
                        }}
                    >
                        {title.textContent}
                    </span>

                    {/* Right: Window buttons (config, maximize, close) - right to left */}
                    <div className="flex items-center gap-1">
                        {/* Config button - hamburger menu */}
                        <div
                            className="flex h-[20px] w-[20px] items-center justify-center"
                            style={{ backgroundColor: global.colors.bg, borderRadius: '50%' }}
                            title="Configure"
                        >
                            {renderIcon(config, global.iconSet.settings, 12)}
                        </div>

                        {/* Maximize/Focus button - square outline */}
                        <div
                            className="flex h-[20px] w-[20px] items-center justify-center"
                            style={{ backgroundColor: global.colors.bg, borderRadius: '50%' }}
                            title="Maximize/Restore"
                        >
                            {renderIcon(config, global.iconSet.maximize, 12)}
                        </div>

                        {/* Close button - X */}
                        <div
                            className="flex h-[20px] w-[20px] items-center justify-center"
                            style={{ backgroundColor: global.colors.bg, borderRadius: '50%' }}
                            title="Close"
                        >
                            {renderIcon(config, global.iconSet.close, 12)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 rounded-lg border border-[#1e293b] bg-[#090d16] p-3 text-xs text-gray-400">
                <p>Preview shows Yakuake layout: Tabs bar on top, Title bar on bottom.</p>
                <p className="mt-1">Icons update based on selected icon library.</p>
            </div>
        </div>
    )
}
