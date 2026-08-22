import { Label } from './Label'
import type { RgbColor } from '../../types'

interface RgbColorInputProps {
    label: string
    value: RgbColor
    onChange: (value: RgbColor) => void
    hint?: string
}

const rgbToHex = (color: RgbColor): string => {
    return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`
}

export const RgbColorInput = ({ label, value, onChange, hint }: RgbColorInputProps) => {
    const hex = rgbToHex(value)

    return (
        <Label label={label} hint={hint}>
            <div className="flex gap-2">
                <input
                    type="color"
                    value={hex}
                    onChange={(e) => {
                        const v = e.currentTarget.value
                        const r = parseInt(v.slice(1, 3), 16)
                        const g = parseInt(v.slice(3, 5), 16)
                        const b = parseInt(v.slice(5, 7), 16)
                        onChange({ r, g, b })
                    }}
                    className="h-9 w-9 cursor-pointer border-0 bg-transparent"
                />
                <input
                    type="text"
                    value={hex}
                    onInput={(e) => {
                        const v = e.currentTarget.value
                        if (v.length === 7 && v[0] === '#') {
                            const r = parseInt(v.slice(1, 3), 16)
                            const g = parseInt(v.slice(3, 5), 16)
                            const b = parseInt(v.slice(5, 7), 16)
                            if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
                                onChange({ r, g, b })
                            }
                        }
                    }}
                    className="w-full rounded-lg border border-[#1e293b] bg-[#090d16] p-1.5 font-mono text-sm text-white"
                />
            </div>
        </Label>
    )
}
