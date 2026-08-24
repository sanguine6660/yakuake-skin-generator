/**
 * @file src/hooks/useDownloadCounter.ts
 * @description Global download counter backed by the public Abacus count API with graceful failure handling
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

import { useCallback, useEffect, useState } from 'preact/hooks'

const COUNTER_API = 'https://abacus.jasoncameron.dev'
const NAMESPACE = 'yakuake_skin_generator'
const KEY = 'downloads'

interface AbacusResponse {
    value?: number
}

export const useDownloadCounter = () => {
    const [totalDownloads, setTotalDownloads] = useState<number | null>(null)

    useEffect(() => {
        let cancelled = false
        const load = async () => {
            try {
                const res = await fetch(`${COUNTER_API}/get/${NAMESPACE}/${KEY}`)
                if (cancelled) return
                if (res.status === 404) {
                    setTotalDownloads(0)
                    return
                }
                if (!res.ok) return
                const data: AbacusResponse = await res.json()
                if (!cancelled && typeof data.value === 'number') setTotalDownloads(data.value)
            } catch {}
        }
        void load()
        return () => {
            cancelled = true
        }
    }, [])

    const incrementDownload = useCallback(async (): Promise<number | null> => {
        try {
            const res = await fetch(`${COUNTER_API}/hit/${NAMESPACE}/${KEY}`)
            if (!res.ok) return null
            const data: AbacusResponse = await res.json()
            if (typeof data.value === 'number') {
                setTotalDownloads(data.value)
                return data.value
            }
        } catch {}
        return null
    }, [])

    return { totalDownloads, incrementDownload }
}
