/**
 * @file src/hooks/useSkinExport.ts
 * @description Custom hook for exporting skin configurations as .tar.gz archives and installing to Yakuake
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

import { useCallback, useState } from 'preact/hooks'
import type { SkinConfig } from '../types'
import { prepareSkinFiles } from '../utils'
import { useGoatCounter } from './useGoatCounter'
import { warmIconMarkupCache } from '../utils/iconRenderer'

let savedDirHandle: any = null

export const useSkinExport = () => {
    const [installStatus, setInstallStatus] = useState<{
        message: string
        type: 'success' | 'error' | 'info'
    } | null>(null)

    const { trackEvent } = useGoatCounter()

    const downloadSkin = useCallback(
        async (config: SkinConfig): Promise<boolean> => {
            warmIconMarkupCache(config, config.global.iconSet.settings)
            warmIconMarkupCache(config, config.global.iconSet.maximize)
            warmIconMarkupCache(config, config.global.iconSet.close)
            const { files, folderName } = prepareSkinFiles(config)
            const { createTarGz } = await import('../utils')
            await createTarGz(files, `${folderName}.tar.gz`)

            // Track successful download event
            trackEvent('skin-download', `Download: ${folderName}`)
            return true
        },
        [trackEvent]
    )

    const installToYakuake = useCallback(
        async (config: SkinConfig): Promise<boolean> => {
            try {
                setInstallStatus({ message: 'Preparing skin for installation...', type: 'info' })

                warmIconMarkupCache(config, config.global.iconSet.settings)
                warmIconMarkupCache(config, config.global.iconSet.maximize)
                warmIconMarkupCache(config, config.global.iconSet.close)
                warmIconMarkupCache(config, config.global.iconSet.plus)
                warmIconMarkupCache(config, config.global.iconSet.minus)
                warmIconMarkupCache(config, config.global.iconSet.lock)

                const { files, folderName } = prepareSkinFiles(config)

                if (!('showDirectoryPicker' in window)) {
                    const { createTarGz } = await import('../utils')
                    await createTarGz(files, `${folderName}.tar.gz`)
                    setInstallStatus({
                        message: `Direct install not supported in this browser. Downloaded ${folderName}.tar.gz. Extract to ~/.local/share/yakuake/skins/${folderName}/`,
                        type: 'info',
                    })

                    // Track fallback download event
                    trackEvent('skin-download-fallback', `Download Fallback: ${folderName}`)
                    return true
                }

                try {
                    let dirHandle: any

                    if (savedDirHandle) {
                        try {
                            const permission = await savedDirHandle.queryPermission({
                                mode: 'readwrite',
                            })
                            if (permission === 'granted') {
                                dirHandle = savedDirHandle
                            }
                        } catch {}
                    }

                    if (!dirHandle) {
                        setInstallStatus({
                            message: 'Select home folder to find Yakuake skins directory...',
                            type: 'info',
                        })
                        dirHandle = await (window as any).showDirectoryPicker({
                            mode: 'readwrite',
                        })
                        await dirHandle.requestPermission({ mode: 'readwrite' })
                        savedDirHandle = dirHandle
                    }

                    let skinsDirHandle: any
                    try {
                        const localHandle = await dirHandle.getDirectoryHandle('.local', {
                            create: false,
                        })
                        const shareHandle = await localHandle.getDirectoryHandle('share', {
                            create: false,
                        })
                        const yakuakeHandle = await shareHandle.getDirectoryHandle('yakuake', {
                            create: false,
                        })
                        skinsDirHandle = await yakuakeHandle.getDirectoryHandle('skins', {
                            create: false,
                        })
                    } catch {}

                    if (skinsDirHandle) {
                        const skinDirHandle = await skinsDirHandle.getDirectoryHandle(folderName, {
                            create: true,
                        })

                        for (const file of files) {
                            const pathParts = file.path.split('/')
                            const fileName = pathParts.pop()!
                            let currentDir = skinDirHandle

                            for (const part of pathParts) {
                                currentDir = await currentDir.getDirectoryHandle(part, {
                                    create: true,
                                })
                            }

                            const fileHandle = await currentDir.getFileHandle(fileName, {
                                create: true,
                            })
                            const writable = await fileHandle.createWritable()
                            await writable.write(file.content)
                            await writable.close()
                        }

                        setInstallStatus({
                            message: `Skin installed to ~/.local/share/yakuake/skins/${folderName}/ (overwritten if existed). Restart Yakuake.`,
                            type: 'success',
                        })

                        // Track successful direct installation event
                        trackEvent('skin-install-success', `Install Success: ${folderName}`)
                        return true
                    }

                    setInstallStatus({
                        message:
                            'Yakuake skins folder not found. Please select ~/.local/share/yakuake/skins/...',
                        type: 'info',
                    })
                    const userDirHandle = await (window as any).showDirectoryPicker({
                        mode: 'readwrite',
                        startIn: 'home',
                    })
                    await userDirHandle.requestPermission({ mode: 'readwrite' })
                    savedDirHandle = userDirHandle
                    skinsDirHandle = userDirHandle

                    const skinDirHandle = await skinsDirHandle.getDirectoryHandle(folderName, {
                        create: true,
                    })

                    for (const file of files) {
                        const pathParts = file.path.split('/')
                        const fileName = pathParts.pop()!
                        let currentDir = skinDirHandle

                        for (const part of pathParts) {
                            currentDir = await currentDir.getDirectoryHandle(part, { create: true })
                        }

                        const fileHandle = await currentDir.getFileHandle(fileName, {
                            create: true,
                        })
                        const writable = await fileHandle.createWritable()
                        await writable.write(file.content)
                        await writable.close()
                    }

                    setInstallStatus({
                        message: `Skin installed to selected folder (overwritten if existed). Restart Yakuake.`,
                        type: 'success',
                    })

                    trackEvent('skin-install-custom', `Install Custom: ${folderName}`)
                    return true
                } catch (err) {
                    if (err instanceof Error && err.name === 'AbortError') {
                        setInstallStatus({ message: 'Installation cancelled', type: 'info' })
                        return false
                    }
                    throw err
                }
            } catch (error) {
                setInstallStatus({
                    message: `Installation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    type: 'error',
                })
                return false
            }
        },
        [trackEvent]
    )

    const clearStatus = useCallback(() => setInstallStatus(null), [])

    return { downloadSkin, installToYakuake, installStatus, clearStatus }
}
