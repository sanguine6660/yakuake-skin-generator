import { defineConfig } from 'vitest/config'
import preact from '@preact/preset-vite'
import fs from 'node:fs'
import path from 'node:path'

const pkg = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
)

export default defineConfig({
    plugins: [preact()],
    define: {
        __APP_VERSION__: JSON.stringify(pkg.version),
    },
    resolve: {
        alias: [
            { find: /^react$/, replacement: 'preact/compat' },
            { find: /^react-dom$/, replacement: 'preact/compat' },
            { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
        ],
    },
    test: {
        environment: 'node',
        include: ['src/**/*.test.{ts,tsx}'],
    },
})
