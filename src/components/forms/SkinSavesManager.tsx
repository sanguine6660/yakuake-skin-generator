/**
 * @file src/components/forms/SkinSavesManager.tsx
 * @description Component for managing saved skins - save, load, rename, delete with localStorage persistence
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

export const SkinSavesManager = ({
    currentSkinName,
    onSave,
    onLoad,
    onDelete,
    onRename,
}: SkinSavesManagerProps) => {
    const [savedSkins, setSavedSkins] = useLocalStorage<Record<string, SavedSkin>>(
        'yakuake-skin-saves',
        {}
    )
    const [showSaveModal, setShowSaveModal] = useState(false)
    const [saveName, setSaveName] = useState('')
    const [renameModal, setRenameModal] = useState<{ oldName: string; newName: string } | null>(
        null
    )

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
        if (
            renameModal &&
            renameModal.newName.trim() &&
            renameModal.newName !== renameModal.oldName
        ) {
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
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-200">My Saved Skins</h3>
                <button
                    onClick={() => {
                        setSaveName(currentSkinName)
                        setShowSaveModal(true)
                    }}
                    className="rounded-lg bg-sky-500 px-4 py-2 font-medium text-white transition-colors hover:bg-sky-600"
                >
                    Save Current Skin
                </button>
            </div>

            {savedSkinsArray.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                    <p className="mb-2">No saved skins yet</p>
                    <p className="text-sm">Create your first skin and save it!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {savedSkinsArray.map((skin) => (
                        <div
                            key={skin.name}
                            className="flex items-center justify-between rounded-lg border border-[#1e293b] bg-[#090d16] p-4"
                        >
                            <div className="flex min-w-0 flex-1 items-center gap-4">
                                <div className="min-w-0 flex-1">
                                    <h4 className="truncate font-medium text-white">{skin.name}</h4>
                                    <p className="truncate text-xs text-gray-400">
                                        Updated: {new Date(skin.updatedAt).toLocaleString()} •
                                        Created: {new Date(skin.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleLoad(skin)}
                                    className="rounded-lg bg-sky-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-sky-600"
                                >
                                    Load
                                </button>
                                <button
                                    onClick={() => handleRenameStart(skin.name)}
                                    className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-600"
                                >
                                    Rename
                                </button>
                                <button
                                    onClick={() => handleDelete(skin.name)}
                                    className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
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
                    <div className="w-full max-w-md rounded-xl border border-[#1e293b] bg-[#121824] p-6">
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
                                className="rounded-lg border border-[#1e293b] px-4 py-2 text-gray-300 transition-colors hover:bg-[#1e293b]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="rounded-lg bg-sky-500 px-4 py-2 font-medium text-white transition-colors hover:bg-sky-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {renameModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-xl border border-[#1e293b] bg-[#121824] p-6">
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
                                className="rounded-lg border border-[#1e293b] px-4 py-2 text-gray-300 transition-colors hover:bg-[#1e293b]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRenameConfirm}
                                className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-white transition-colors hover:bg-amber-600"
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
