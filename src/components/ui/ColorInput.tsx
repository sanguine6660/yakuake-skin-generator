import { Label } from './Label'

interface ColorInputProps {
    label: string
    value: string
    onChange: (value: string) => void
    hint?: string
}

export const ColorInput = ({ label, value, onChange, hint }: ColorInputProps) => (
    <Label label={label} hint={hint}>
        <div className="flex gap-2">
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.currentTarget.value)}
                className="h-9 w-9 cursor-pointer border-0 bg-transparent"
            />
            <input
                type="text"
                value={value}
                onInput={(e) => onChange(e.currentTarget.value)}
                className="w-full rounded-lg border border-[#1e293b] bg-[#090d16] p-1.5 font-mono text-sm text-white"
            />
        </div>
    </Label>
)
