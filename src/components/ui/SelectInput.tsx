import { Label } from './Label'

interface SelectInputProps {
    label: string
    value: string
    onChange: (value: string) => void
    options: { value: string; label: string }[]
    hint?: string
}

export const SelectInput = ({ label, value, onChange, options, hint }: SelectInputProps) => (
    <Label label={label} hint={hint}>
        <select
            value={value}
            onChange={(e) => onChange(e.currentTarget.value)}
            className="w-full rounded-lg border border-[#1e293b] bg-[#090d16] p-2 text-sm text-white"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </Label>
)
