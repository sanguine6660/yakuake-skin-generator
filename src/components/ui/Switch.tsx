import type { SkinConfig } from '../../types'
import { renderIcon } from '../../utils/iconRenderer'

interface SwitchProps {
    label: string
    checked: boolean
    onChange: (checked: boolean) => void
    disabled?: boolean
    config: SkinConfig
}

export const Switch = ({ label, checked, onChange, disabled, config }: SwitchProps) => {
    const id = `switch-${label.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).slice(2, 9)}`

    return (
        <label className="relative flex items-center gap-3 cursor-pointer">
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={(e) => onChange(e.currentTarget.checked)}
                disabled={disabled}
                className="peer appearance-none w-11 h-5 bg-gray-600 rounded-full checked:bg-green-500 cursor-pointer transition-colors duration-300"
            />
            <label
                htmlFor={id}
                className="absolute top-1/2 -translate-y-1/2 left-0 w-5 h-5 bg-white rounded-full border border-gray-400 shadow-sm transition-transform duration-300 peer-checked:translate-x-[22px] peer-checked:border-green-500 cursor-pointer flex items-center justify-center"
            >
                {checked
                    ? renderIcon(config, config.global.iconSet.maximize, 8, '#166534')
                    : renderIcon(config, config.global.iconSet.close, 8, '#991b1b')
                }
            </label>
            <span className="text-sm text-gray-300">{label}</span>
        </label>
    )
}