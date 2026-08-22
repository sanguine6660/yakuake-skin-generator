import type { SkinConfig } from '../../types'

interface ColorPreviewProps {
    config: SkinConfig
}

export const ColorPreview = ({ config }: ColorPreviewProps) => {
    const { global } = config

    return (
        <div className="rounded-xl border border-[#1e293b] bg-[#121824] p-6 shadow-xl">
            <h3 className="mb-3 text-lg font-semibold text-gray-200">Color Palette Preview</h3>
            <div className="grid grid-cols-4 gap-2">
                {[
                    { name: 'Background', color: global.colors.bg },
                    { name: 'Selected', color: global.colors.selected },
                    { name: 'Text', color: global.colors.text },
                    { name: 'Dim', color: global.colors.dim },
                ].map(({ name, color }) => (
                    <div key={name} className="flex flex-col items-center gap-1">
                        <div
                            className="h-12 w-full rounded-lg border border-[#1e293b]"
                            style={{ backgroundColor: color }}
                        />
                        <span className="text-xs text-gray-400">{name}</span>
                        <span className="font-mono text-xs">{color}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
