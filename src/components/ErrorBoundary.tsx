/**
 * @file src/components/ErrorBoundary.tsx
 * @description Top-level error boundary that keeps the app recoverable when a render crash happens
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

import { Component } from 'preact'
import type { ComponentChildren } from 'preact'

interface ErrorBoundaryProps {
    children: ComponentChildren
}

interface ErrorBoundaryState {
    error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error }
    }

    componentDidCatch(error: Error) {
        console.error('Unhandled render error:', error)
    }

    private reset = () => {
        this.setState({ error: null })
    }

    render() {
        if (this.state.error) {
            return (
                <div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#090d16] px-6 text-center text-slate-200">
                    <h1 class="text-2xl font-bold">Something went wrong</h1>
                    <p class="max-w-md text-sm text-slate-400">
                        The generator crashed unexpectedly. Your configuration is kept in browser
                        storage — reloading should restore it.
                    </p>
                    <pre class="max-w-full overflow-auto rounded-lg bg-black/40 p-3 text-left text-xs text-red-300">
                        {this.state.error.message}
                    </pre>
                    <div class="flex gap-3">
                        <button
                            type="button"
                            onClick={this.reset}
                            class="rounded-lg bg-[#66c2f2] px-4 py-2 text-sm font-semibold text-[#090d16] transition hover:brightness-110"
                        >
                            Try again
                        </button>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            class="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                        >
                            Reload app
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
