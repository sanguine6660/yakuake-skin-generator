import { Label } from './Label'

interface TextInputProps {
    label: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    hint?: string
}

export const TextInput = ({ label, value, onChange, placeholder, hint }: TextInputProps) => (
    <Label label={label} hint={hint}>
        <input
            type="text"
            value={value}
            onInput={(e) => onChange(e.currentTarget.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-[#1e293b] bg-[#090d16] p-2 text-sm text-white"
        />
    </Label>
)
