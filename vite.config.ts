import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        preact(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['logo.svg', 'PWA/ios/180.png'],
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
                icons: [
                    {
                        src: 'PWA/android/launchericon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'PWA/android/launchericon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: 'PWA/android/launchericon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                globPatterns: [
                    'index.html',
                    'assets/index-*.js',
                    'assets/index-*.css',
                    'assets/rolldown-runtime-*.js',
                    'logo.svg',
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
