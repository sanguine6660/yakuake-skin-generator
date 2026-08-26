/**
 * @file src/utils/parity.test.ts
 * @description Golden-file contract tests: the TypeScript generator output must stay
 * byte-identical to the Rust port in src-tauri. Both suites compare against the
 * shared goldens in src-tauri/tests/goldens/.
 *
 * Regenerate goldens after an INTENTIONAL generator change:
 *   UPDATE_PARITY_GOLDENS=1 npm run test:parity
 * then run `cargo test --manifest-path src-tauri/Cargo.toml` to confirm the Rust
 * side still matches.
 *
 * @copyright Copyright (C) 2026 sanguine6660
 * @since 1.1.0
 * @license GPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { prepareSkinFiles } from './skinFileGenerator'
import type { SkinConfig } from '../types'

const REPO_ROOT = path.resolve(__dirname, '..', '..')
const FIXTURE_PATH = path.join(REPO_ROOT, 'src-tauri', 'tests', 'fixtures', 'config.json')
const GOLDENS_DIR = path.join(REPO_ROOT, 'src-tauri', 'tests', 'goldens')

const config = JSON.parse(readFileSync(FIXTURE_PATH, 'utf-8')) as SkinConfig

const BYTE_PARITY_FILES = [
    'parity_skin.colorscheme',
    'LICENSE',
    'README.md',
    'title.skin',
    'tabs.skin',
    'logo.svg',
    'title/background_center.svg',
    'title/background_left.svg',
    'title/background_right.svg',
    'title/config_up.svg',
    'title/config_over.svg',
    'title/config_down.svg',
    'title/focus_up.svg',
    'title/focus_over.svg',
    'title/focus_down.svg',
    'title/quit_up.svg',
    'title/quit_over.svg',
    'title/quit_down.svg',
    'tabs/background_center.svg',
    'tabs/background_left.svg',
    'tabs/background_right.svg',
    'tabs/tab_selected.svg',
    'tabs/tab_unselected.svg',
    'tabs/tab_selected_left.svg',
    'tabs/tab_selected_middle.svg',
    'tabs/tab_selected_right.svg',
    'tabs/tab_unselected_left.svg',
    'tabs/tab_unselected_middle.svg',
    'tabs/tab_unselected_right.svg',
    'tabs/tab_separator.svg',
    'tabs/lock.svg',
    'tabs/plus_up.svg',
    'tabs/plus_over.svg',
    'tabs/plus_down.svg',
    'tabs/minus_up.svg',
    'tabs/minus_over.svg',
    'tabs/minus_down.svg',
    'tabs/close_up.svg',
    'tabs/close_over.svg',
    'tabs/close_down.svg',
]

const decode = (content: Uint8Array): string => new TextDecoder().decode(content)

describe('TS ↔ Rust golden parity', () => {
    const { files } = prepareSkinFiles(config)
    const byPath = new Map(files.map((f) => [f.path.replace(/^parity_skin\//, ''), f]))

    it('produces every whitelisted file', () => {
        for (const rel of BYTE_PARITY_FILES) {
            expect(byPath.has(rel), `missing generated file: ${rel}`).toBe(true)
        }
    })

    for (const rel of BYTE_PARITY_FILES) {
        it(`matches golden: ${rel}`, () => {
            const actual = decode(byPath.get(rel)!.content)
            const goldenPath = path.join(GOLDENS_DIR, rel)

            if (process.env.UPDATE_PARITY_GOLDENS === '1') {
                mkdirSync(path.dirname(goldenPath), { recursive: true })
                writeFileSync(goldenPath, actual)
            }

            const expected = readFileSync(goldenPath, 'utf-8')
            expect(actual).toBe(expected)
        })
    }

    it('metadata.json matches structurally (icons excluded)', () => {
        const actual = JSON.parse(decode(byPath.get('metadata.json')!.content))
        const goldenPath = path.join(GOLDENS_DIR, 'metadata.json')

        if (process.env.UPDATE_PARITY_GOLDENS === '1') {
            writeFileSync(goldenPath, JSON.stringify(actual, null, 4))
        }

        const expected = JSON.parse(readFileSync(goldenPath, 'utf-8'))
        // Icon markup depends on the browser-side icon library; the Rust CLI
        // legitimately produces none. The generator version follows
        // package.json and changes independently of generator output.
        delete actual.config.icons
        delete expected.config.icons
        delete actual.generator.version
        delete expected.generator.version
        expect(actual).toEqual(expected)
    })
})
