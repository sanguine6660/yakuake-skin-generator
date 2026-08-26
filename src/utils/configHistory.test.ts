/**
 * @file src/utils/configHistory.test.ts
 * @description Tests for the pure undo/redo history engine
 * @copyright Copyright (C) 2026 sanguine6660
 * @since 1.1.0
 * @license GPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import type { SkinConfig } from '../types'
import { createDefaultSkinConfig } from '../constants'
import { HISTORY_LIMIT, MERGE_WINDOW_MS, initHistory, pushEdit, redo, undo } from './configHistory'

const base = createDefaultSkinConfig()
const edit = (name: string): SkinConfig => ({
    ...base,
    title: { ...base.title, textContent: name },
})

describe('pushEdit', () => {
    it('stores the previous config on a fresh edit and clears the redo branch', () => {
        let h = initHistory(base)
        h = pushEdit(h, edit('one'), 1000)
        expect(h.past).toEqual([base])
        expect(h.present.title.textContent).toBe('one')
        expect(h.future).toEqual([])
    })

    it('merges edits within the merge window', () => {
        let h = initHistory(base)
        h = pushEdit(h, edit('drag-1'), 1000)
        h = pushEdit(h, edit('drag-2'), 1000 + MERGE_WINDOW_MS - 1)
        h = pushEdit(h, edit('drag-3'), 1000 + 2 * (MERGE_WINDOW_MS - 1))
        // One undo must return to the pre-drag state.
        expect(h.past).toHaveLength(1)
        const undone = undo(h)!
        expect(undone.present).toBe(base)
    })

    it('creates separate entries outside the merge window', () => {
        let h = initHistory(base)
        h = pushEdit(h, edit('a'), 1000)
        h = pushEdit(h, edit('b'), 1000 + MERGE_WINDOW_MS + 1)
        expect(h.past).toHaveLength(2)
        expect(undo(h)!.present.title.textContent).toBe('a')
    })

    it('does not merge when coalescing is disabled', () => {
        let h = initHistory(base)
        h = pushEdit(h, edit('a'), 1000)
        h = pushEdit(h, edit('b'), 1000, false)
        expect(h.past).toHaveLength(2)
    })

    it('ignores no-op edits', () => {
        let h = initHistory(base)
        const before = h
        expect(pushEdit(h, base, 1000)).toBe(before)
    })

    it('caps the stack at the history limit', () => {
        let h = initHistory(base)
        for (let i = 0; i < HISTORY_LIMIT + 25; i++) {
            h = pushEdit(h, edit(`step-${i}`), 1000 + i * (MERGE_WINDOW_MS + 1))
        }
        expect(h.past).toHaveLength(HISTORY_LIMIT)
        // Oldest surviving entry is step-24; stepping back that far is possible.
        for (let i = 0; i < HISTORY_LIMIT; i++) h = undo(h)!
        expect(h.present.title.textContent).toBe('step-24')
        expect(undo(h)).toBeNull()
    })
})

describe('undo / redo', () => {
    it('round-trips through undo and redo', () => {
        let h = initHistory(base)
        h = pushEdit(h, edit('a'), 1000)
        h = pushEdit(h, edit('b'), 2000)

        const undone = undo(h)!
        expect(undone.present.title.textContent).toBe('a')
        expect(undone.future.map((c) => c.title.textContent)).toEqual(['b'])

        const redone = redo(undone)!
        expect(redone.present.title.textContent).toBe('b')
        expect(redone.past.map((c) => c.title.textContent)).toEqual([base.title.textContent, 'a'])
    })

    it('returns null at the boundaries', () => {
        let h = initHistory(base)
        expect(undo(h)).toBeNull()
        expect(redo(h)).toBeNull()
        h = pushEdit(h, edit('x'), 1000)
        expect(redo(h)).toBeNull()
        h = undo(h)!
        expect(undo(h)).toBeNull()
        expect(redo(h)).not.toBeNull()
    })

    it('a fresh edit after undo discards the redo branch', () => {
        let h = initHistory(base)
        h = pushEdit(h, edit('a'), 1000)
        h = undo(h)!
        h = pushEdit(h, edit('branch'), 5000)
        expect(h.future).toEqual([])
        expect(redo(h)).toBeNull()
        expect(h.present.title.textContent).toBe('branch')
    })

    it('never mutates the previous state object', () => {
        let h = initHistory(base)
        const snapshot = structuredClone(h)
        h = pushEdit(h, edit('a'), 1000)
        h = undo(h)!
        h = redo(h)!
        expect(structuredClone(h)).not.toBe(snapshot)
        expect(snapshot.past).toEqual([])
    })
})
