import type { SkinConfig, ButtonConfig } from '../../types'
import { NumberInput, TextInput, Switch } from '../ui'

interface ButtonConfigEditorProps {
    config: ButtonConfig
    label: string
    onChange: (updates: Partial<ButtonConfig>) => void
    globalConfig: SkinConfig
}

export const ButtonConfigEditor = ({ config, label, onChange, globalConfig }: ButtonConfigEditorProps) => (
    <div className="bg-[#090d16] p-4 rounded-lg border border-[#1e293b]">
        <div className="mb-3 flex items-center justify-between">
            <h4 className="font-medium text-white capitalize">{label} Button</h4>
            <Switch
                label="Enabled"
                checked={config.enabled}
                onChange={(v) => onChange({ enabled: v })}
                config={globalConfig}
            />
        </div>

        <div className={`grid grid-cols-1 gap-4 md:grid-cols-3 ${!config.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <Switch
                label="Enabled"
                checked={config.enabled}
                onChange={(v) => onChange({ enabled: v })}
                config={globalConfig}
            />
            <div className="md:col-span-2 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <TextInput
                        label="Up Image"
                        value={config.up}
                        onChange={(v) => onChange({ up: v })}
                        placeholder="/title/focus_up.svg"
                    />
                    <TextInput
                        label="Over Image"
                        value={config.over}
                        onChange={(v) => onChange({ over: v })}
                        placeholder="/title/focus_over.svg"
                    />
                </div>
                <TextInput
                    label="Down Image"
                    value={config.down}
                    onChange={(v) => onChange({ down: v })}
                    placeholder="/title/focus_down.svg"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <NumberInput
                    label="X Position"
                    value={config.x}
                    onChange={(v) => onChange({ x: v })}
                    min={0}
                    max={200}
                />
                <NumberInput
                    label="Y Position"
                    value={config.y}
                    onChange={(v) => onChange({ y: v })}
                    min={0}
                    max={50}
                />
            </div>
        </div>
    </div>
)