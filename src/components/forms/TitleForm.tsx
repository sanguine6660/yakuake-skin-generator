import type { SkinConfig, RgbColor } from '../../types'
import { NumberInput, TextInput, RgbColorInput, CheckboxInput } from '../ui'

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
            <CheckboxInput
                label="Bold Text"
                checked={title.textBold}
                onChange={(v) => onChange({ textBold: v })}
            />

            <h3 className="mt-6 mb-3 text-lg font-semibold text-gray-200">
                Background Translucency
            </h3>
            <CheckboxInput
                label="Enable Translucent Background"
                checked={title.bgTranslucent ?? false}
                onChange={(v) => onChange({ bgTranslucent: v })}
            />

            <h3 className="mb-3 text-lg font-semibold text-gray-200">
                Button Visibility & Positions
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                    <CheckboxInput
                        label="Show Focus/Maximize Button"
                        checked={title.focusBtnEnabled ?? true}
                        onChange={(v) => onChange({ focusBtnEnabled: v })}
                    />
                    <NumberInput
                        label="Focus X"
                        value={title.focusBtnX}
                        onChange={(v) => onChange({ focusBtnX: v })}
                        min={0}
                        max={200}
                    />
                    <NumberInput
                        label="Focus Y"
                        value={title.focusBtnY}
                        onChange={(v) => onChange({ focusBtnY: v })}
                        min={0}
                        max={50}
                    />
                </div>
                <div className="space-y-2">
                    <CheckboxInput
                        label="Show Config/Settings Button"
                        checked={title.configBtnEnabled ?? true}
                        onChange={(v) => onChange({ configBtnEnabled: v })}
                    />
                    <NumberInput
                        label="Config X"
                        value={title.configBtnX}
                        onChange={(v) => onChange({ configBtnX: v })}
                        min={0}
                        max={200}
                    />
                    <NumberInput
                        label="Config Y"
                        value={title.configBtnY}
                        onChange={(v) => onChange({ configBtnY: v })}
                        min={0}
                        max={50}
                    />
                </div>
                <div className="space-y-2">
                    <CheckboxInput
                        label="Show Quit/Close Button"
                        checked={title.quitBtnEnabled ?? true}
                        onChange={(v) => onChange({ quitBtnEnabled: v })}
                    />
                    <NumberInput
                        label="Quit X"
                        value={title.quitBtnX}
                        onChange={(v) => onChange({ quitBtnX: v })}
                        min={0}
                        max={200}
                    />
                    <NumberInput
                        label="Quit Y"
                        value={title.quitBtnY}
                        onChange={(v) => onChange({ quitBtnY: v })}
                        min={0}
                        max={50}
                    />
                </div>
            </div>
        </div>
    )
}
