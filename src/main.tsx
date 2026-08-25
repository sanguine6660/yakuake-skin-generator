/**
 * @file src/main.tsx
 * @description Application entry point - renders the App, records startup time and dismisses the loading screen
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

import { render } from 'preact'
import './index.css'
import { App } from './app.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { StartupTimesRecorder, readAverageStartupTime } from './utils/startupTimes.tsx'

const startedAt = performance.timeOrigin
const loadedAt = startedAt + performance.now()

render(
    <>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
        <StartupTimesRecorder start={startedAt} loaded={loadedAt} />
    </>,
    document.getElementById('app')!
)

const MIN_EXTRA_MS = 1000
const actualLoadTime = loadedAt - startedAt
const fallbackLoadTime = readAverageStartupTime()
const minDisplayMs = (actualLoadTime > 0 ? actualLoadTime : fallbackLoadTime) + MIN_EXTRA_MS

const loadingScreen = document.getElementById('loading-screen')
if (loadingScreen) {
    const remaining = Math.max(0, minDisplayMs - performance.now())
    setTimeout(() => {
        loadingScreen.classList.add('loading-screen--hidden')
        setTimeout(() => {
            loadingScreen.remove()
            window.dispatchEvent(new Event('loading-screen-finished'))
        }, 400)
    }, remaining)
}
