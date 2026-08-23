import type { SkinMeta } from '../../types'
import { TextInput } from '../ui/TextInput'

interface MetaFormProps {
    meta: SkinMeta
    onChange: (updates: Partial<SkinMeta>) => void
}

export const MetaForm = ({ meta, onChange }: MetaFormProps) => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextInput
            label="Skin Name"
            value={meta.skinName}
            onChange={(v) => onChange({ skinName: v })}
        />
        <TextInput label="Author" value={meta.author} onChange={(v) => onChange({ author: v })} />
        <TextInput label="Email" value={meta.email} onChange={(v) => onChange({ email: v })} />
        <TextInput
            label="Website (optional)"
            value={meta.web || ''}
            onChange={(v) => onChange({ web: v })}
            placeholder="https://github.com/yourname"
        />
    </div>
)