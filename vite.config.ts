import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'node:fs'
import path from 'node:path'

// The Tauri CLI sets TAURI_ENV_* for beforeDevCommand/beforeBuildCommand.
// Inside the desktop app the frontend is served from a custom protocol at
// the origin root and must not register a service worker.
const isTauri = process.env.TAURI_ENV_PLATFORM !== undefined
const baseUrl = isTauri ? './' : '/yakuake-skin-generator/'

// Load icons safely from public/icons.json at build time
const iconsPath = path.resolve(__dirname, 'public/icons.json')
const pwaIcons = fs.existsSync(iconsPath) ? JSON.parse(fs.readFileSync(iconsPath, 'utf-8')) : []

// Single source of truth for the app version, injected as __APP_VERSION__
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'))

export default defineConfig(() => ({
    clearScreen: false,
    server: {
        port: 4000,
        strictPort: true,
    },
    envPrefix: ['VITE_', 'TAURI_ENV_'],
    define: {
        __APP_VERSION__: JSON.stringify(pkg.version),
    },
    plugins: [
        preact(),
        tailwindcss(),
        ...(isTauri
            ? []
            : [
                  VitePWA({
                      registerType: 'autoUpdate',
                      includeAssets: ['logo.svg', 'PWA/ios/180.png', 'icons.json'],
                      manifest: {
                          name: 'Yakuake Skin Generator',
                          short_name: 'Skin Generator',
                          description:
                              'Create custom Yakuake terminal skins with live WYSIWYG preview, 60+ presets, random themes, round-trip skin folder import and matching Konsole color schemes.',
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
              ]),
        {
            name: 'html-base-transform',
            transformIndexHtml(html) {
                let result = html.replace(/%BASE_URL%/g, baseUrl)
                if (isTauri) {
                    // The desktop app must not phone home to analytics.
                    result = result.replace(
                        /[ \t]*<!-- Goat Counter Tracking -->\s*<script[^>]*gc\.zgo\.at[^>]*>\s*<\/script>\s*/i,
                        ''
                    )
                }
                return result
            },
        },
    ],
    base: baseUrl,
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
}))
