import type { SkinConfig } from '../../types'

interface ExportFormProps {
    config: SkinConfig
    downloadSkin: (config: SkinConfig) => void
    installToYakuake: (config: SkinConfig) => void
    installStatus: { message: string; type: 'success' | 'error' | 'info' } | null
    clearStatus: () => void
}

export const ExportForm = ({
    config,
    downloadSkin,
    installToYakuake,
    installStatus,
    clearStatus,
}: ExportFormProps) => {
    const accentColor = config.global.colors.text

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <button
                    onClick={() => installToYakuake(config)}
                    style={{ backgroundColor: accentColor, color: '#090d16' }}
                    className="w-full cursor-pointer rounded-xl p-4 text-lg font-bold shadow-xl transition hover:opacity-90"
                >
                    Install to Yakuake
                </button>
                <button
                    onClick={() => downloadSkin(config)}
                    style={{
                        backgroundColor: '#3b4252',
                        color: accentColor,
                        border: `1px solid ${accentColor}`,
                    }}
                    className="w-full cursor-pointer rounded-xl p-4 text-lg font-bold transition hover:opacity-90"
                >
                    Download .tar.gz
                </button>
            </div>

            {installStatus && (
                <div
                    className="rounded-lg border p-4 transition-all"
                    style={{
                        backgroundColor:
                            installStatus.type === 'error'
                                ? '#3d1a1a'
                                : installStatus.type === 'success'
                                  ? '#1a3d1a'
                                  : '#1a2d3d',
                        borderColor:
                            installStatus.type === 'error'
                                ? '#bf616a'
                                : installStatus.type === 'success'
                                  ? '#a3be8c'
                                  : '#66c2f2',
                        color:
                            installStatus.type === 'error'
                                ? '#ff6b6b'
                                : installStatus.type === 'success'
                                  ? '#a3be8c'
                                  : '#66c2f2',
                    }}
                >
                    <div className="flex items-center justify-between">
                        <p className="text-sm">{installStatus.message}</p>
                        <button
                            onClick={clearStatus}
                            className="text-lg leading-none text-gray-400 hover:text-white"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            <div className="rounded-xl border border-[#1e293b] bg-[#121824] p-6 shadow-xl">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-200">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        style={{ color: accentColor }}
                    >
                        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
                        <path
                            d="M10 6v8M6 10h8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                    How to Install
                </h3>
                <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-start gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-700 font-mono text-xs text-white">
                            1
                        </span>
                        <div>
                            <p className="font-medium text-white">Auto-Install (Recommended)</p>
                            <p>
                                Click "Install to Yakuake" → select{' '}
                                <code className="rounded bg-gray-700 px-1 text-xs">
                                    ~/.local/share/yakuake/skins/
                                </code>{' '}
                                → done!
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-700 font-mono text-xs text-white">
                            2
                        </span>
                        <div>
                            <p className="font-medium text-white">Manual Install</p>
                            <p>
                                Click "Download .tar.gz" → extract to{' '}
                                <code className="rounded bg-gray-700 px-1 text-xs">
                                    ~/.local/share/yakuake/skins/
                                </code>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-700 font-mono text-xs text-white">
                            3
                        </span>
                        <div>
                            <p className="font-medium text-white">Apply in Yakuake</p>
                            <p>
                                Open Yakuake → Right-click title bar → Configure → Appearance →
                                Select your skin → Apply
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-700 font-mono text-xs text-white">
                            4
                        </span>
                        <div>
                            <p className="font-medium text-white">Restart if needed</p>
                            <p>
                                Run{' '}
                                <code className="rounded bg-gray-700 px-1 text-xs">
                                    killall yakuake && yakuake
                                </code>{' '}
                                if skin doesn't appear immediately
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
