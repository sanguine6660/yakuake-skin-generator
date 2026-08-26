#!/usr/bin/env node
// 1. Read source of truth from package.json
// 2. Sync version String where ever needed:
//    - package-lock.json          (root + packages[""])
//    - src-tauri/tauri.conf.json  (app/bundle version)
//    - src-tauri/Cargo.toml       ([package] version -> CARGO_PKG_VERSION)
//    - src-tauri/Cargo.lock       (local package entry)

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = path.resolve(import.meta.dirname ?? '.', '..')

const readText = (rel) => fs.readFileSync(path.join(root, rel), 'utf-8')
const writeIfChanged = (rel, next) => {
    const full = path.join(root, rel)
    if (fs.existsSync(full) && fs.readFileSync(full, 'utf-8') === next) return false
    fs.writeFileSync(full, next)
    return true
}

const pkg = JSON.parse(readText('package.json'))
const version = pkg.version

if (!version || !/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version)) {
    console.error(`No valid semver version in package.json (found: ${pkg.version})`)
    process.exit(1)
}

let changed = 0
const report = (rel, updated) => {
    changed += updated ? 1 : 0
    console.log(updated ? `✓ ${rel} -> ${version}` : `• ${rel} already ${version}`)
}

// package-lock.json ----------------------------------------------------------
// Targeted line surgery: rewrite only the root `version` and the
// packages[""] `version` entry so npm's exact file formatting is preserved.
{
    const rel = 'package-lock.json'
    if (fs.existsSync(path.join(root, rel))) {
        const text = readText(rel)
        let idx = 0
        let touched = false
        const next = text.replace(/^(\s*)"version": "[^"]+",?$/gm, (line) => {
            idx++
            if (idx > 2 || line.includes(`"${version}"`)) return line
            touched = true
            return line.replace(/"version": "[^"]+"/, `"version": "${version}"`)
        })
        report(rel, touched && writeIfChanged(rel, next))
    } else {
        console.log(`• ${rel} not present (run npm install to generate it)`)
    }
}

// src-tauri/tauri.conf.json --------------------------------------------------
{
    const rel = 'src-tauri/tauri.conf.json'
    const conf = JSON.parse(readText(rel))
    if (conf.version !== version) {
        conf.version = version
        report(rel, writeIfChanged(rel, JSON.stringify(conf, null, 4) + '\n'))
    } else {
        report(rel, false)
    }
}

// Cargo.toml / Cargo.lock ----------------------------------------------------
// Rewrites only the `version` key of the targeted `[package]` / `[[package]]`
// block; for Cargo.lock the block is identified by its crate name.
const setTomlVersion = (rel, { requirePackageName } = {}) => {
    const lines = readText(rel).split('\n')
    let section = ''
    let active = !requirePackageName
    let name = null
    let hit = false

    const out = lines.map((line) => {
        const header = line.match(/^\[{1,2}(.+?)\]{1,2}\s*$/)
        if (header) {
            section = header[1]
            active = section === 'package' && !requirePackageName
            name = null
            return line
        }

        const nameMatch = line.match(/^name\s*=\s*"([^"]+)"/)
        if (nameMatch) {
            name = nameMatch[1]
            if (requirePackageName) active = name === requirePackageName
            return line
        }
        if (!active) return line

        if (/^version\s*=\s*"/.test(line) && (!requirePackageName || name === requirePackageName)) {
            if (!hit) {
                hit = true
                return line.replace(/^version\s*=\s*"[^"]+"/, `version = "${version}"`)
            }
        }
        return line
    })

    if (!hit) {
        console.warn(
            `⚠ ${rel}: no ${requirePackageName ? `${requirePackageName} ` : ''}version entry found`
        )
        return
    }
    report(rel, writeIfChanged(rel, out.join('\n')))
}

setTomlVersion('src-tauri/Cargo.toml')
setTomlVersion('src-tauri/Cargo.lock', { requirePackageName: 'yakuake-skin-generator' })

// ----------------------------------------------------------------------------
console.log(
    changed > 0 ? `Version sync complete! (${changed} file(s) updated)` : 'Version sync complete!'
)
