/**
 * @file src/hooks/useAppUpdater.ts
 * @description Desktop-only auto-update check backed by the Tauri updater plugin
 * @copyright Copyright (C) 2026 sanguine6660
 * @since 1.1.0
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

import { useCallback, useEffect, useState } from 'preact/hooks'
import { isTauri } from '../utils'
import type { DownloadEvent } from '@tauri-apps/plugin-updater'

export type UpdateState = 'idle' | 'checking' | 'downloading' | 'ready' | 'uptodate' | 'error'

/**
 * Checks GitHub releases for a newer signed desktop build and installs it.
 * No-op in the browser build.
 */
export const useAppUpdater = () => {
    const [state, setState] = useState<UpdateState>('idle')
    const [pendingVersion, setPendingVersion] = useState<string | null>(null)
    const [progress, setProgress] = useState(0)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const check = useCallback(async () => {
        if (!isTauri()) return
        setState('checking')
        setErrorMessage(null)
        try {
            const { check } = await import('@tauri-apps/plugin-updater')
            const update = await check()
            if (!update) {
                setState('uptodate')
                return
            }
            setPendingVersion(update.version)
            setState('downloading')
            let total = 0
            let received = 0
            await update.downloadAndInstall((event: DownloadEvent) => {
                if (event.event === 'Started' && event.data.contentLength) {
                    total = event.data.contentLength
                } else if (event.event === 'Progress') {
                    received += event.data.chunkLength
                    if (total > 0) setProgress(Math.round((received / total) * 100))
                }
            })
            setProgress(100)
            setState('ready')
        } catch (error) {
            setState('error')
            setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
        }
    }, [])

    // Check silently once on startup (desktop builds only).
    useEffect(() => {
        void check()
    }, [check])

    return { state, pendingVersion, progress, errorMessage, check }
}
