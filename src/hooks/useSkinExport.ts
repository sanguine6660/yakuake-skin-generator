import { useCallback, useState } from 'preact/hooks'
import type { SkinConfig } from '../types'
import { prepareSkinFiles } from '../utils'

let savedDirHandle: any = null

export const useSkinExport = () => {
    const [installStatus, setInstallStatus] = useState<{
        message: string
        type: 'success' | 'error' | 'info'
    } | null>(null)

    const downloadSkin = useCallback(async (config: SkinConfig) => {
        const { files, folderName } = prepareSkinFiles(config)
        const { createTarGz } = await import('../utils')
        await createTarGz(files, `${folderName}.tar.gz`)
    }, [])

    const installToYakuake = useCallback(async (config: SkinConfig) => {
        try {
            setInstallStatus({ message: 'Preparing skin for installation...', type: 'info' })

            const { files, folderName } = prepareSkinFiles(config)

            if (!('showDirectoryPicker' in window)) {
                const { createTarGz } = await import('../utils')
                await createTarGz(files, `${folderName}.tar.gz`)
                setInstallStatus({
                    message: `Direct install not supported in this browser. Downloaded ${folderName}.tar.gz. Extract to ~/.local/share/yakuake/skins/${folderName}/`,
                    type: 'info',
                })
                return
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
                    } catch {
                        // Permission lost, will ask again
                    }
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

                // Try to navigate to ~/.local/share/yakuake/skins/
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
                } catch {
                    // Path doesn't exist or no permission, fallback to user selection
                }

                if (skinsDirHandle) {
                    // Found it! Create skin folder there
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
                        message: `Skin installed to ~/.local/share/yakuake/skins/${folderName}/ (overwritten if existed). Restart Yakuake.`,
                        type: 'success',
                    })
                    return
                }

                // Yakuake skins folder not found, let user select it
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

                    const fileHandle = await currentDir.getFileHandle(fileName, { create: true })
                    const writable = await fileHandle.createWritable()
                    await writable.write(file.content)
                    await writable.close()
                }

                setInstallStatus({
                    message: `Skin installed to selected folder (overwritten if existed). Restart Yakuake.`,
                    type: 'success',
                })
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    setInstallStatus({ message: 'Installation cancelled', type: 'info' })
                    return
                }
                throw err
            }
        } catch (error) {
            setInstallStatus({
                message: `Installation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                type: 'error',
            })
        }
    }, [])

    const clearStatus = useCallback(() => setInstallStatus(null), [])

    return { downloadSkin, installToYakuake, installStatus, clearStatus }
}
