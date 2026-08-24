import { defineConfig } from 'vitest/config'
import preact from '@preact/preset-vite'

console.log('VITEST CONFIG LOADED')

export default defineConfig({
    plugins: [preact()],
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
