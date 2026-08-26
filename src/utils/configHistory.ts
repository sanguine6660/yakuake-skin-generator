/**
 * @file src/utils/configHistory.ts
 * @description Pure undo/redo history engine for skin configurations.
 * Rapid successive edits (color-picker drags, multi-part actions like preset
 * application) are coalesced into a single history entry via a merge window;
 * the stack is capped so long sessions stay bounded.
 *
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

import type { SkinConfig } from '../types'

/** Maximum number of stored undo steps. */
export const HISTORY_LIMIT = 200

/**
 * Edits landing within this window are merged into the previous step, so
 * bursts (slider drags, one logical action spread over several setters)
 * become a single undo entry.
 */
export const MERGE_WINDOW_MS = 400

export interface HistoryState {
    past: SkinConfig[]
    present: SkinConfig
    future: SkinConfig[]
    /** Timestamp of the last accepted edit; 0 disables merging. */
    lastEditAt: number
}

export const initHistory = (present: SkinConfig): HistoryState => ({
    past: [],
    present,
    future: [],
    lastEditAt: 0,
})

/**
 * Records an edit. When `now` falls inside the merge window of the previous
 * edit the present is replaced without growing the stack; otherwise the old
 * present is pushed onto `past`. Any fresh edit discards the redo branch.
 */
export const pushEdit = (
    state: HistoryState,
    next: SkinConfig,
    now: number,
    coalesce = true
): HistoryState => {
    if (next === state.present) return state

    const merged = coalesce && state.lastEditAt !== 0 && now - state.lastEditAt <= MERGE_WINDOW_MS

    if (merged) {
        return { ...state, present: next, lastEditAt: now }
    }

    const past =
        state.past.length >= HISTORY_LIMIT
            ? [...state.past.slice(-(HISTORY_LIMIT - 1)), state.present]
            : [...state.past, state.present]

    return { past, present: next, future: [], lastEditAt: now }
}

/** Steps back one entry; returns null when there is nothing to undo. */
export const undo = (state: HistoryState): HistoryState | null => {
    const previous = state.past[state.past.length - 1]
    if (previous === undefined) return null
    return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future].slice(0, HISTORY_LIMIT),
        lastEditAt: 0,
    }
}

/** Steps forward one entry; returns null when there is nothing to redo. */
export const redo = (state: HistoryState): HistoryState | null => {
    const [next, ...rest] = state.future
    if (next === undefined) return null
    return {
        past: [...state.past, state.present].slice(-HISTORY_LIMIT),
        present: next,
        future: rest,
        lastEditAt: 0,
    }
}
