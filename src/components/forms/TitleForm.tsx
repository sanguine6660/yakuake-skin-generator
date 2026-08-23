import type { SkinConfig, RgbColor } from '../../types'
import { NumberInput, TextInput, RgbColorInput, Switch, ButtonConfigEditor } from '../ui'

interface TitleFormProps {
    config: SkinConfig
    onChange: (updates: Partial<SkinConfig['title']>) => void
    onRgbColorChange: (colorKey: string, rgb: RgbColor) => void
}

export const TitleForm = ({ config, onChange, onRgbColorChange }: TitleFormProps) => {
    const { title } = config

    return (
        <div className="space-y-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-200">Border</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <RgbColorInput
                    label="Border Color"
                    value={title.borderColor}
                    onChange={(v) => onRgbColorChange('borderColor', v)}
                />
                <NumberInput
                    label="Border Width"
                    value={title.borderWidth}
                    onChange={(v) => onChange({ borderWidth: v })}
                    min={0}
                    max={20}
                />
            </div>

            <h3 className="mb-3 text-lg font-semibold text-gray-200">Title Text</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <NumberInput
                    label="X Position"
                    value={title.textX}
                    onChange={(v) => onChange({ textX: v })}
                    min={0}
                    max={200}
                />
                <NumberInput
                    label="Y Position"
                    value={title.textY}
                    onChange={(v) => onChange({ textY: v })}
                    min={0}
                    max={50}
                />
                <RgbColorInput
                    label="Text Color"
                    value={title.textColor}
                    onChange={(v) => onRgbColorChange('textColor', v)}
                />
                <TextInput
                    label="Text Content"
                    value={title.textContent}
                    onChange={(v) => onChange({ textContent: v })}
                />
            </div>
            <Switch
                label="Bold Text"
                checked={title.textBold}
                onChange={(v) => onChange({ textBold: v })}
                config={config}
            />

            <h3 className="mt-6 mb-3 text-lg font-semibold text-gray-200">
                Background Translucency
            </h3>
            <Switch
                label="Enable Translucent Background"
                checked={title.bgTranslucent ?? false}
                onChange={(v) => onChange({ bgTranslucent: v })}
                config={config}
            />

            <h3 className="mb-3 text-lg font-semibold text-gray-200">Title Bar Enabled</h3>
            <Switch
                label="Enable Title Bar"
                checked={title.titleEnabled ?? true}
                onChange={(v) => onChange({ titleEnabled: v })}
                config={config}
            />

            <div className="space-y-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-200">Focus/Maximize Button</h3>
                <ButtonConfigEditor
                    config={config.title.focusBtn}
                    label="Focus/Maximize"
                    onChange={(updates) => onChange({ focusBtn: { ...config.title.focusBtn, ...updates } })}
                    globalConfig={config}
                />

                <h3 className="mb-3 text-lg font-semibold text-gray-200">Config/Settings Button</h3>
                <ButtonConfigEditor
                    config={config.title.configBtn}
                    label="Config/Settings"
                    onChange={(updates) => onChange({ configBtn: { ...config.title.configBtn, ...updates } })}
                    globalConfig={config}
                />

                <h3 className="mb-3 text-lg font-semibold text-gray-200">Quit/Close Button</h3>
                <ButtonConfigEditor
                    config={config.title.quitBtn}
                    label="Quit/Close"
                    onChange={(updates) => onChange({ quitBtn: { ...config.title.quitBtn, ...updates } })}
                    globalConfig={config}
                />
            </div>
        </div>
    )
}