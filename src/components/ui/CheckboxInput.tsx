import { Label } from './Label'

interface CheckboxInputProps {
    label: string
    checked: boolean
    onChange: (value: boolean) => void
    hint?: string
}

export const CheckboxInput = ({ label, checked, onChange, hint }: CheckboxInputProps) => (
    <Label label={label} hint={hint}>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.currentTarget.checked)}
                className="h-4 w-4 accent-sky-400"
            />
            <span>{label}</span>
        </label>
    </Label>
)
