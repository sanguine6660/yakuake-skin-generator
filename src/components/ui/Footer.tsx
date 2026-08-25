/**
 * @file src/components/ui/Footer.tsx
 * @description Page footer with logo, copyright and license notice, links to the repository, issues, skin format wiki and Yakuake source, and a privacy notice trigger
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

import { isTauri } from '../../utils'
import { useAppUpdater } from '../../hooks'
import type { UpdateState } from '../../hooks'

interface FooterProps {
    onOpenPrivacy: () => void
}

const REPO_URL = 'https://github.com/sanguine6660/yakuake-skin-generator'
const ISSUES_URL = `${REPO_URL}/issues`
const WIKI_URL = `${REPO_URL}/blob/main/WIKI.md`
const YAKUAKE_SOURCE_URL = 'https://invent.kde.org/utilities/yakuake'
const GPL_LICENSE_URL = 'https://www.gnu.org/licenses/gpl-3.0'
const CC_LICENSE_URL = 'https://creativecommons.org/licenses/by/4.0/'

const UPDATE_MESSAGES: Partial<Record<UpdateState, string>> = {
    checking: 'Checking for updates…',
    uptodate: 'Up to date',
    error: 'Update check failed',
}

export const Footer = ({ onOpenPrivacy }: FooterProps) => {
    const logoSrc = `${import.meta.env.BASE_URL}logo.svg`
    const updater = useAppUpdater()

    const links: Array<{ label: string; href?: string; onClick?: () => void }> = [
        { label: 'GitHub', href: REPO_URL },
        { label: 'Issues', href: ISSUES_URL },
        { label: 'Skin Format Wiki', href: WIKI_URL },
        { label: 'Yakuake Source', href: YAKUAKE_SOURCE_URL },
        { label: 'Privacy', onClick: onOpenPrivacy },
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
                        <p className="text-xs text-gray-500">© 2026 sanguine6660</p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-gray-600">
                            Editor code licensed under{' '}
                            <a
                                href={GPL_LICENSE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors hover:text-gray-400"
                            >
                                GPL-3.0-or-later
                            </a>
                            . Generated skins licensed under{' '}
                            <a
                                href={CC_LICENSE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors hover:text-gray-400"
                            >
                                CC BY 4.0
                            </a>
                            .
                        </p>
                    </div>
                </div>

                <nav
                    className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm"
                    aria-label="Footer"
                >
                    {links.map(({ label, href, onClick }) =>
                        href ? (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 transition-colors hover:text-white"
                            >
                                {label}
                            </a>
                        ) : (
                            <button
                                key={label}
                                type="button"
                                onClick={onClick}
                                className="cursor-pointer text-gray-400 transition-colors hover:text-white"
                            >
                                {label}
                            </button>
                        )
                    )}
                </nav>
            </div>

            {isTauri() && (
                <div className="mt-4 flex justify-center">
                    {updater.state === 'downloading' ? (
                        <p className="text-xs text-gray-500">
                            Downloading update{updater.pendingVersion ? ` ${updater.pendingVersion}` : ''}
                            {updater.progress > 0 ? ` — ${updater.progress}%` : '…'}
                        </p>
                    ) : updater.state === 'ready' ? (
                        <p className="text-xs text-gray-400">
                            Update installed — restart the app to apply it.
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={() => void updater.check()}
                            className="cursor-pointer text-xs text-gray-600 transition-colors hover:text-gray-400"
                            title={updater.errorMessage ?? undefined}
                        >
                            {UPDATE_MESSAGES[updater.state] ?? `Check for updates (v${__APP_VERSION__})`}
                        </button>
                    )}
                </div>
            )}
        </footer>
    )
}
