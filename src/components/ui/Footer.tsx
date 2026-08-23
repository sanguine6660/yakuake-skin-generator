/**
 * @file src/components/ui/Footer.tsx
 * @description Page footer with logo, copyright notice and links to the repository, issues, skin format wiki and Yakuake source
 * @copyright Copyright (C) 2026 sanguine6660
 * @since 1.0.0
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

import type { SkinConfig } from '../../types'

interface FooterProps {
    config: SkinConfig
}

const REPO_URL = 'https://github.com/sanguine6660/yakuake-skin-generator'
const ISSUES_URL = `${REPO_URL}/issues`
const WIKI_URL = `${REPO_URL}/blob/main/WIKI.md`
const YAKUAKE_SOURCE_URL = 'https://invent.kde.org/utilities/yakuake'

export const Footer = ({ config }: FooterProps) => {
    const accentColor = config.global.colors.text
    const logoSrc = `${import.meta.env.BASE_URL}logo.svg`

    const links = [
        { label: 'GitHub', href: REPO_URL },
        { label: 'Issues', href: ISSUES_URL },
        { label: 'Skin Format Wiki', href: WIKI_URL },
        { label: 'Yakuake Source', href: YAKUAKE_SOURCE_URL },
    ]

    return (
        <footer className="mt-10 border-t border-[#1e293b] pt-6 pb-4">
            <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
                <div className="flex items-center gap-3">
                    <img
                        src={logoSrc}
                        alt="Yakuake Skin Generator logo"
                        className="h-9 w-9"
                        loading="lazy"
                    />
                    <div>
                        <p className="text-sm font-medium text-gray-300">Yakuake Skin Generator</p>
                        <p className="text-xs text-gray-500">
                            © 2026 sanguine6660 · GPL-3.0-or-later
                        </p>
                    </div>
                </div>

                <nav
                    className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm"
                    aria-label="Footer"
                >
                    {links.map(({ label, href }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 transition-colors hover:text-white"
                            style={{ textDecorationColor: accentColor }}
                        >
                            {label}
                        </a>
                    ))}
                </nav>
            </div>
        </footer>
    )
}
