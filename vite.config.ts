import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'node:fs'
import path from 'node:path'

// Load icons safely from public/icons.json at build time
const iconsPath = path.resolve(__dirname, 'public/icons.json')
const pwaIcons = fs.existsSync(iconsPath) ? JSON.parse(fs.readFileSync(iconsPath, 'utf-8')) : []

export default defineConfig({
    plugins: [
        preact(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['logo.svg', 'PWA/ios/180.png', 'icons.json'],
            manifest: {
                name: 'Yakuake Skin Generator',
                short_name: 'Skin Generator',
                description:
                    'Create, customize, and export custom Yakuake terminal skins with live preview, presets, and 28 icon libraries.',
                theme_color: '#66c2f2',
                background_color: '#090d16',
                display: 'standalone',
                lang: 'en',
                start_url: '/yakuake-skin-generator/',
                scope: '/yakuake-skin-generator/',
                icons: pwaIcons,
            },
            workbox: {
                globPatterns: [
                    'index.html',
                    'assets/index-*.js',
                    'assets/index-*.css',
                    'assets/rolldown-runtime-*.js',
                    'logo.svg',
                    'icons.json',
                    'PWA/**/*.png',
                ],
                runtimeCaching: [
                    {
                        urlPattern: /assets\/icon-.+\.js$/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'icon-libraries',
                            expiration: {
                                maxEntries: 40,
                                maxAgeSeconds: 60 * 60 * 24 * 90,
                            },
                            cacheableResponse: { statuses: [200] },
                        },
                    },
                ],
            },
        }),
        {
            name: 'html-base-transform',
            transformIndexHtml(html) {
                const base = '/yakuake-skin-generator/'
                return html.replace(/%BASE_URL%/g, base)
            },
        },
    ],
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
