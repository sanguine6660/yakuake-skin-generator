import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [preact(), tailwindcss()],
    base: '/yakuake-skin-generator/',
    build: {
        chunkSizeWarningLimit: 8096,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/react-icons/')) {
                        const match = id.match(/node_modules\/react-icons\/([a-z0-9]+)\//)
                        if (match && match[1]) {
                            return `icon-${match[1]}`
                        }
                        return 'vendor-icons'
                    }
                },
            },
        },
    },
})
