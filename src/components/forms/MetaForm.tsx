/**
 * @file src/components/forms/MetaForm.tsx
 * @description Form component for editing skin metadata (name, author, email, website)
 * @copyright Copyright (C) 2026 sanguine6660
 * @since 1.0.0
 * @license GPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

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
