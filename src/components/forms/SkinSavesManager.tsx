import { useState } from 'preact/hooks'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { TextInput } from '../ui'

interface SkinSavesManagerProps {
    currentSkinName: string
    onSave: (name: string) => void
    onLoad: (savedConfig: any) => void
    onDelete: (name: string) => void
    onRename: (oldName: string, newName: string) => void
}

interface SavedSkin {
    name: string
    config: any
    createdAt: number
    updatedAt: number
}

export const SkinSavesManager = ({ currentSkinName, onSave, onLoad, onDelete, onRename }: SkinSavesManagerProps) => {
    const [savedSkins, setSavedSkins] = useLocalStorage<Record<string, SavedSkin>>('yakuake-skin-saves', {})
    const [showSaveModal, setShowSaveModal] = useState(false)
    const [saveName, setSaveName] = useState('')
    const [renameModal, setRenameModal] = useState<{ oldName: string; newName: string } | null>(null)

    const handleSave = () => {
        if (saveName.trim()) {
            onSave(saveName.trim())
            setSaveName('')
            setShowSaveModal(false)
        }
    }

    const handleLoad = (savedSkin: SavedSkin) => {
        onLoad(savedSkin.config)
    }

    const handleDelete = (name: string) => {
        if (window.confirm(`Delete skin "${name}"?`)) {
            setSavedSkins((prev) => {
                const updated = { ...prev }
                delete updated[name]
                return updated
            })
            onDelete(name)
        }
    }

    const handleRenameStart = (name: string) => {
        setRenameModal({ oldName: name, newName: name })
    }

    const handleRenameConfirm = () => {
        if (renameModal && renameModal.newName.trim() && renameModal.newName !== renameModal.oldName) {
            setSavedSkins((prev) => {
                const { [renameModal.oldName]: _, ...rest } = prev
                const updated = {
                    ...rest,
                    [renameModal.newName.trim()]: {
                        ...prev[renameModal.oldName],
                        name: renameModal.newName.trim(),
                        updatedAt: Date.now(),
                    },
                }
                return updated
            })
            onRename(renameModal.oldName, renameModal.newName.trim())
            setRenameModal(null)
        }
    }

    const savedSkinsArray = Object.values(savedSkins).sort((a, b) => b.updatedAt - a.updatedAt)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-200">My Saved Skins</h3>
                <button
                    onClick={() => {
                        setSaveName(currentSkinName)
                        setShowSaveModal(true)
                    }}
                    className="px-4 py-2 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 transition-colors"
                >
                    Save Current Skin
                </button>
            </div>

            {savedSkinsArray.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <p className="mb-2">No saved skins yet</p>
                    <p className="text-sm">Create your first skin and save it!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {savedSkinsArray.map((skin) => (
                        <div
                            key={skin.name}
                            className="bg-[#090d16] p-4 rounded-lg border border-[#1e293b] flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-white truncate">{skin.name}</h4>
                                    <p className="text-xs text-gray-400 truncate">
                                        Updated: {new Date(skin.updatedAt).toLocaleString()} • Created: {new Date(skin.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleLoad(skin)}
                                    className="px-3 py-1.5 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600 transition-colors"
                                >
                                    Load
                                </button>
                                <button
                                    onClick={() => handleRenameStart(skin.name)}
                                    className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
                                >
                                    Rename
                                </button>
                                <button
                                    onClick={() => handleDelete(skin.name)}
                                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[#121824] rounded-xl p-6 w-full max-w-md border border-[#1e293b]">
                        <h4 className="mb-4 text-lg font-semibold text-white">Save Skin</h4>
                        <TextInput
                            label="Skin Name"
                            value={saveName}
                            onChange={setSaveName}
                            placeholder="Enter skin name"
                        />
                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="px-4 py-2 border border-[#1e293b] rounded-lg text-gray-300 hover:bg-[#1e293b] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {renameModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[#121824] rounded-xl p-6 w-full max-w-md border border-[#1e293b]">
                        <h4 className="mb-4 text-lg font-semibold text-white">Rename Skin</h4>
                        <TextInput
                            label="New Name"
                            value={renameModal.newName}
                            onChange={(v) => setRenameModal({ ...renameModal, newName: v })}
                            placeholder="Enter new name"
                        />
                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                onClick={() => setRenameModal(null)}
                                className="px-4 py-2 border border-[#1e293b] rounded-lg text-gray-300 hover:bg-[#1e293b] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRenameConfirm}
                                className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
                            >
                                Rename
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}