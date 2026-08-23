/**
 * @file src/components/ui/Modal.tsx
 * @description Accessible modal dialog component with size variants and keyboard support
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

import type { ComponentChildren } from 'preact'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ComponentChildren
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
    if (!isOpen) return null

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className="fixed inset-0 bg-black/50 transition-opacity"
                    onClick={onClose}
                    aria-hidden="true"
                />
                <div
                    className={`relative w-full ${sizeClasses[size]} overflow-hidden rounded-xl border border-[#1e293b] bg-[#121824] shadow-2xl`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div className="flex items-center justify-between border-b border-[#1e293b] p-4">
                        <h3 id="modal-title" className="text-lg font-semibold text-white">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                            aria-label="Close modal"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M15 5L5 15M5 5l10 10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="max-h-[70vh] overflow-y-auto p-4">{children}</div>
                </div>
            </div>
        </div>
    )
}
