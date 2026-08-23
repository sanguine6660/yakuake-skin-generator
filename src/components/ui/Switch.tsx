import type { SkinConfig } from '../../types'
import { renderIcon } from '../../utils/iconRenderer'

interface SwitchProps {
    label: string
    checked: boolean
    onChange: (checked: boolean) => void
    disabled?: boolean
    config: SkinConfig
}

export const Switch = ({ label, checked, onChange, disabled, config }: SwitchProps) => (
    <label className="flex items-center gap-3 cursor-pointer">
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            disabled={disabled}
            className={`relative w-11 h-6 rounded-full transition-all duration-200 ease-in-out flex items-center justify-center p-1 ${
                checked 
                    ? 'bg-green-500 border-green-500' 
                    : 'bg-gray-600 border-gray-500 hover:border-red-400 hover:bg-gray-500'
            }`}
            aria-label={label}
        >
            <span className={`transition-transform duration-200 ease-in-out w-4 h-4 rounded-full flex items-center justify-center ${
                checked ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white'
            }`}>
                {checked 
                    ? renderIcon(config, config.global.iconSet.maximize, 10, '#166534')
                    : renderIcon(config, config.global.iconSet.close, 10, '#991b1b')
                }
            </span>
        </button>
        <span className="text-sm text-gray-300">{label}</span>
    </label>
)