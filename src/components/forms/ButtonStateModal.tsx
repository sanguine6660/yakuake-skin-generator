import type { SkinConfig, ButtonColors, ButtonStateColors } from '../../types'
import { ColorInput, Switch } from '../ui'
import { Modal } from '../ui/Modal'

interface ButtonStateModalProps {
    isOpen: boolean
    onClose: () => void
    config: SkinConfig
    button: keyof ButtonColors
    buttonLabel: string
    onColorChange: (button: keyof ButtonColors, state: keyof ButtonStateColors, value: string) => void
}

const STATES = [
    { key: 'up' as const, label: 'Normal (Up)', bgKey: 'upBg', iconKey: 'upIcon' },
    { key: 'over' as const, label: 'Hover (Over)', bgKey: 'overBg', iconKey: 'overIcon' },
    { key: 'down' as const, label: 'Pressed (Down)', bgKey: 'downBg', iconKey: 'downIcon' },
] as const

export const ButtonStateModal = ({
    isOpen,
    onClose,
    config,
    button,
    buttonLabel,
    onColorChange,
}: ButtonStateModalProps) => {
    const buttonColors = config.global.buttonColors[button]

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${buttonLabel} Button - State Colors`}
            size="lg"
        >
            <div className="space-y-4">
                <div className="bg-[#090d16] p-3 rounded-lg border border-[#1e293b]">
                    <Switch
                        label="Transparent Background (all states)"
                        checked={config.global.buttonColors[button].upBg === 'transparent'}
                        onChange={(enabled) => {
                            if (enabled) {
                                onColorChange(button, 'upBg', 'transparent')
                                onColorChange(button, 'overBg', 'transparent')
                                onColorChange(button, 'downBg', 'transparent')
                            }
                        }}
                        config={config}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        When enabled, backgrounds become transparent and only icon colors are used.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {STATES.map(({ key, label, bgKey, iconKey }) => (
                        <div key={key} className="bg-[#090d16] p-4 rounded-lg border border-[#1e293b]">
                            <h4 className="mb-3 text-sm font-medium text-gray-300 capitalize">{label} State</h4>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Background Color</label>
                                    <ColorInput
                                        label=""
                                        value={buttonColors[bgKey]}
                                        onChange={(v) => onColorChange(button, bgKey, v)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Icon Color</label>
                                    <ColorInput
                                        label=""
                                        value={buttonColors[iconKey]}
                                        onChange={(v) => onColorChange(button, iconKey, v)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    )
}