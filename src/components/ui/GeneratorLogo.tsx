/**
 * @file src/components/ui/GeneratorLogo.tsx
 * @description Generator logo components - inline SVG and programmatic logo generation
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

const GEN_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <rect width="48" height="48" rx="10" fill="currentColor"/>
  <path d="M12 24 L20 32 L36 16" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="24" cy="24" r="5" fill="white"/>
</svg>`

export const GeneratorLogo = ({
    size = 48,
    color = 'currentColor',
    className = '',
}: {
    size?: number
    color?: string
    className?: string
}) => {
    const svg = GEN_LOGO_SVG.replace(
        'width="48" height="48"',
        `width="${size}" height="${size}"`
    ).replace('fill="currentColor"', `fill="${color}"`)

    return <span dangerouslySetInnerHTML={{ __html: svg }} className={className} />
}

export const GeneratorLogoSvg = ({
    size = 48,
    bgColor = '#66c2f2',
    strokeColor = 'white',
}: {
    size?: number
    bgColor?: string
    strokeColor?: string
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
        >
            <rect width={size} height={size} rx={size / 4.8} fill={bgColor} />
            <path
                d={`M${size * 0.25} ${size * 0.5} L${size * 0.417} ${size * 0.667} L${size * 0.75} ${size * 0.333}`}
                stroke={strokeColor}
                strokeWidth={size * 0.0625}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx={size * 0.5} cy={size * 0.5} r={size * 0.104} fill={strokeColor} />
        </svg>
    )
}

export const getGeneratorLogoSvg = (config: SkinConfig, size = 48): string => {
    const { bg, text } = config.global.colors
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">
  <rect width="${size}" height="${size}" rx="${size / 4.8}" fill="${bg}" stroke="${text}" stroke-width="${size * 0.042}"/>
  <path d="M${size * 0.25} ${size * 0.5} L${size * 0.417} ${size * 0.667} L${size * 0.75} ${size * 0.333}" stroke="${text}" stroke-width="${size * 0.0625}" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.104}" fill="${text}"/>
</svg>`
}
