import { Label } from './Label'

interface NumberInputProps {
    label: string
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
    step?: number
    hint?: string
    showValue?: boolean
}

export const NumberInput = ({
    label,
    value,
    onChange,
    min = 0,
    max = 500,
    step = 1,
    hint,
    showValue = true,
}: NumberInputProps) => (
    <Label label={label} hint={hint}>
        <div className="flex items-center gap-2">
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onInput={(e) => onChange(Number(e.currentTarget.value))}
                className="flex-1 cursor-pointer accent-sky-400"
            />
            {showValue && <span className="w-12 text-right text-sm text-gray-300">{value}</span>}
        </div>
    </Label>
)
