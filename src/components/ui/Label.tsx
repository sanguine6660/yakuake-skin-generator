import type { ComponentChildren } from 'preact'

interface LabelProps {
    label: string
    children: ComponentChildren
    hint?: string
}

export const Label = ({ label, children, hint }: LabelProps) => (
    <div>
        <label className="mb-1 block flex items-center gap-1 text-xs text-gray-400">
            {label}
            {hint && <span className="text-[10px] text-gray-600">({hint})</span>}
        </label>
        {children}
    </div>
)
