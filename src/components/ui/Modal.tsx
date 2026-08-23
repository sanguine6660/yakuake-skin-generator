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
                    className={`relative w-full ${sizeClasses[size]} bg-[#121824] rounded-xl border border-[#1e293b] shadow-2xl overflow-hidden`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div className="flex items-center justify-between p-4 border-b border-[#1e293b]">
                        <h3 id="modal-title" className="text-lg font-semibold text-white">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                            aria-label="Close modal"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <div className="p-4 max-h-[70vh] overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}