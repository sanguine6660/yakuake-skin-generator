/**
 * @file src/components/ui/Popover.tsx
 * @description Portal-based fixed-position popover that anchors to a trigger element without affecting document flow
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

import { useEffect, useRef, useState } from 'preact/hooks'
import { createPortal } from 'preact/compat'
import type { ComponentChildren } from 'preact'

interface PopoverProps {
    triggerRef: { current: HTMLElement | null }
    onClose: () => void
    children: ComponentChildren
    width?: number
    matchTriggerWidth?: boolean
}

export const Popover = ({
    triggerRef,
    onClose,
    children,
    width = 256,
    matchTriggerWidth = false,
}: PopoverProps) => {
    const popoverRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(
        null
    )

    useEffect(() => {
        const update = () => {
            const trigger = triggerRef.current
            const popover = popoverRef.current
            if (!trigger || !popover) return
            const rect = trigger.getBoundingClientRect()
            const popRect = popover.getBoundingClientRect()
            const resolvedWidth = matchTriggerWidth ? rect.width : width

            let top = rect.bottom + 6
            if (top + popRect.height > window.innerHeight - 8) {
                top = Math.max(8, rect.top - popRect.height - 6)
            }
            let left = rect.left
            if (left + resolvedWidth > window.innerWidth - 8) {
                left = window.innerWidth - resolvedWidth - 8
            }
            setPosition({ top: Math.max(8, top), left: Math.max(8, left), width: resolvedWidth })
        }

        update()
        window.addEventListener('resize', update)
        window.addEventListener('scroll', update, true)
        return () => {
            window.removeEventListener('resize', update)
            window.removeEventListener('scroll', update, true)
        }
    }, [triggerRef, matchTriggerWidth, width])

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            const target = e.target as Node
            if (popoverRef.current?.contains(target)) return
            if (triggerRef.current?.contains(target)) return
            onClose()
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('mousedown', handleMouseDown)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [onClose, triggerRef])

    const triggerRect = triggerRef.current?.getBoundingClientRect()
    const style: Record<string, string | number> = {
        top: position?.top ?? (triggerRect?.bottom ?? 0) + 6,
        left: position?.left ?? (triggerRect?.left ?? 0),
        width: position?.width ?? (matchTriggerWidth ? (triggerRect?.width ?? width) : width),
        visibility: position ? 'visible' : 'hidden',
    }

    return createPortal(
        <div
            ref={popoverRef}
            className="fixed z-[70] overflow-hidden rounded-xl border border-[#1e293b] bg-[#121824] shadow-xl"
            style={style}
            role="dialog"
        >
            {children}
        </div>,
        document.body
    )
}