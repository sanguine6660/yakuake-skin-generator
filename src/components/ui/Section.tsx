import type { ComponentChildren } from 'preact'

interface SectionProps {
    title: string
    children: ComponentChildren
    color?: string
    iconColor?: string
}

export const Section = ({ title, children, color, iconColor }: SectionProps) => (
    <section className="rounded-xl border border-[#1e293b] bg-[#121824] p-6 shadow-xl">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-200">
            <span style={{ color: color || iconColor }}>{title}</span>
        </h2>
        <div>{children}</div>
    </section>
)
