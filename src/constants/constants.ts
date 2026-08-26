/**
 * @file src/constants/constants.ts
 * @description Default configurations, icon library mappings, and icon role definitions
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

import type {
    IconRole,
    IconLibrary,
    IconSet,
    SkinMeta,
    RgbColor,
    SkinConfig,
    ButtonColors,
} from '../types'
import { deriveKonsoleBackground } from '../utils/colors'

export const ICON_LIBRARIES: Record<IconLibrary, string> = {
    lucide: 'Lucide',
    fa: 'Font Awesome 5',
    fa6: 'Font Awesome 6',
    io: 'Ionicons 4',
    io5: 'Ionicons 5',
    md: 'Material Design Icons',
    ti: 'Typicons',
    go: 'GitHub Octicons',
    fi: 'Feather Icons',
    gi: 'Game Icons',
    wi: 'Weather Icons',
    di: 'Devicons',
    ai: 'Ant Design Icons',
    bs: 'Bootstrap Icons',
    ri: 'Remix Icon',
    fc: 'Flat Color Icons',
    gr: 'Grommet Icons',
    hi: 'Heroicons',
    hi2: 'Heroicons 2',
    si: 'Simple Icons',
    sl: 'Simple Line Icons',
    im: 'IcoMoon Free',
    bi: 'BoxIcons',
    cg: 'css.gg',
    vsc: 'VS Code Icons',
    tb: 'Tabler Icons',
    tfi: 'Themify Icons',
    pi: 'Phosphor Icons',
}

export const ICON_ROLES: { key: IconRole; label: string }[] = [
    { key: 'settings', label: 'Settings/Config' },
    { key: 'maximize', label: 'Maximize/Focus' },
    { key: 'close', label: 'Close/Quit' },
    { key: 'plus', label: 'Plus/New Tab' },
    { key: 'minus', label: 'Minus/Close Tab' },
    { key: 'lock', label: 'Lock/Prevent Close' },
]

export const DEFAULT_ICON_SETS: Record<IconLibrary, IconSet> = {
    lucide: {
        settings: 'LuSettings',
        maximize: 'LuMaximize2',
        close: 'LuX',
        plus: 'LuPlus',
        minus: 'LuMinus',
        lock: 'LuLock',
    },
    fa: {
        settings: 'FaCog',
        maximize: 'FaExpand',
        close: 'FaTimes',
        plus: 'FaPlus',
        minus: 'FaMinus',
        lock: 'FaLock',
    },
    fa6: {
        settings: 'FaGear',
        maximize: 'FaExpand',
        close: 'FaXmark',
        plus: 'FaPlus',
        minus: 'FaMinus',
        lock: 'FaLock',
    },
    io: {
        settings: 'IoAndroidSettings',
        maximize: 'IoAndroidExpand',
        close: 'IoClose',
        plus: 'IoAndroidAdd',
        minus: 'IoAndroidRemove',
        lock: 'IoAndroidLock',
    },
    io5: {
        settings: 'IoSettingsOutline',
        maximize: 'IoExpandOutline',
        close: 'IoCloseOutline',
        plus: 'IoAddOutline',
        minus: 'IoRemoveOutline',
        lock: 'IoLockClosedOutline',
    },
    md: {
        settings: 'MdSettings',
        maximize: 'MdFullscreen',
        close: 'MdClose',
        plus: 'MdAdd',
        minus: 'MdRemove',
        lock: 'MdLock',
    },
    ti: {
        settings: 'TiCog',
        maximize: 'TiArrowMaximise',
        close: 'TiTimes',
        plus: 'TiPlus',
        minus: 'TiMinus',
        lock: 'TiLockClosed',
    },
    go: {
        settings: 'GoGear',
        maximize: 'GoScreenFull',
        close: 'GoX',
        plus: 'GoPlus',
        minus: 'GoDash',
        lock: 'GoLock',
    },
    fi: {
        settings: 'FiSettings',
        maximize: 'FiMaximize2',
        close: 'FiX',
        plus: 'FiPlus',
        minus: 'FiMinus',
        lock: 'FiLock',
    },
    gi: {
        settings: 'GiCogs',
        maximize: 'GiResize',
        close: 'GiCancel',
        plus: 'GiPlus',
        minus: 'GiMinus',
        lock: 'GiPadlock',
    },
    wi: {
        settings: 'WiSettings',
        maximize: 'WiNa',
        close: 'WiClose',
        plus: 'WiNa',
        minus: 'WiNa',
        lock: 'WiNa',
    },
    di: {
        settings: 'DiGhost',
        maximize: 'DiHtml5',
        close: 'DiCss3',
        plus: 'DiJsBadge',
        minus: 'DiPython',
        lock: 'DiTerminal',
    },
    ai: {
        settings: 'AiFillSetting',
        maximize: 'AiOutlineFullscreen',
        close: 'AiOutlineClose',
        plus: 'AiOutlinePlus',
        minus: 'AiOutlineMinus',
        lock: 'AiOutlineLock',
    },
    bs: {
        settings: 'BsGear',
        maximize: 'BsFullscreen',
        close: 'BsX',
        plus: 'BsPlus',
        minus: 'BsDash',
        lock: 'BsLock',
    },
    ri: {
        settings: 'RiSettings3Line',
        maximize: 'RiFullscreenLine',
        close: 'RiCloseLine',
        plus: 'RiAddLine',
        minus: 'RiSubtractLine',
        lock: 'RiLockLine',
    },
    fc: {
        settings: 'FcSettings',
        maximize: 'FcFullScreen',
        close: 'FcCancel',
        plus: 'FcPlus',
        minus: 'FcMinus',
        lock: 'FcLock',
    },
    gr: {
        settings: 'GrSettings',
        maximize: 'GrExpand',
        close: 'GrClose',
        plus: 'GrAdd',
        minus: 'GrSubtract',
        lock: 'GrLock',
    },
    hi: {
        settings: 'HiCog',
        maximize: 'HiDesktopComputer',
        close: 'HiX',
        plus: 'HiPlus',
        minus: 'HiMinus',
        lock: 'HiLockClosed',
    },
    hi2: {
        settings: 'HiCog',
        maximize: 'HiArrowsPointingOut',
        close: 'HiXMark',
        plus: 'HiPlus',
        minus: 'HiMinus',
        lock: 'HiLockClosed',
    },
    si: {
        settings: 'SiAptos',
        maximize: 'SiArchlinux',
        close: 'SiCplusplus',
        plus: 'SiGnubash',
        minus: 'SiLinux',
        lock: 'SiUbuntu',
    },
    sl: {
        settings: 'SlSettings',
        maximize: 'SlSize-fullscreen',
        close: 'SlClose',
        plus: 'SlPlus',
        minus: 'SlMinus',
        lock: 'SlLock',
    },
    im: {
        settings: 'ImCog',
        maximize: 'ImEnlarge',
        close: 'ImCross',
        plus: 'ImPlus',
        minus: 'ImMinus',
        lock: 'ImLock',
    },
    bi: {
        settings: 'BiCog',
        maximize: 'BiFullscreen',
        close: 'BiX',
        plus: 'BiPlus',
        minus: 'BiMinus',
        lock: 'BiLock',
    },
    cg: {
        settings: 'CgOptions',
        maximize: 'CgMaximize',
        close: 'CgClose',
        plus: 'CgMathPlus',
        minus: 'CgMathMinus',
        lock: 'CgLock',
    },
    vsc: {
        settings: 'VscSettings',
        maximize: 'VscScreenFull',
        close: 'VscClose',
        plus: 'VscAdd',
        minus: 'VscRemove',
        lock: 'VscLock',
    },
    tb: {
        settings: 'TbSettings',
        maximize: 'TbMaximize',
        close: 'TbX',
        plus: 'TbPlus',
        minus: 'TbMinus',
        lock: 'TbLock',
    },
    tfi: {
        settings: 'TfiSettings',
        maximize: 'TfiFullscreen',
        close: 'TfiClose',
        plus: 'TfiPlus',
        minus: 'TfiMinus',
        lock: 'TfiLock',
    },
    pi: {
        settings: 'PiGear',
        maximize: 'PiMaximize',
        close: 'PiX',
        plus: 'PiPlus',
        minus: 'PiMinus',
        lock: 'PiLock',
    },
}

export const DEFAULT_META: SkinMeta = {
    skinName: 'My Custom Skin',
    author: 'Your Name',
    email: 'you@example.com',
    web: 'https://github.com/sanguine6660/yakuake-skin-generator',
    icon: '/logo.svg',
}

/**
 * Attribution stamped onto generated/applied skins (presets and randomizer).
 * CC BY 4.0 requires crediting the original creator when skins are shared.
 */
export const SKIN_ATTRIBUTION = {
    author: 'sanguine6660',
    email: 'sanguine6660@gmail.com',
    web: 'https://github.com/sanguine6660/yakuake-skin-generator',
} as const

export const DEFAULT_RGB_COLORS = {
    bg: { r: 30, g: 34, b: 51 } as RgbColor,
    selected: { r: 59, g: 66, b: 82 } as RgbColor,
    text: { r: 102, g: 194, b: 242 } as RgbColor,
    dim: { r: 35, g: 40, b: 52 } as RgbColor,
    border: { r: 0, g: 0, b: 0 } as RgbColor,
}

export const DEFAULT_TITLE_CONFIG = {
    borderColor: DEFAULT_RGB_COLORS.border,
    borderWidth: 0,
    textX: 14,
    textY: 18,
    textColor: DEFAULT_RGB_COLORS.text,
    textContent: 'My Custom Skin',
    textBold: true,
    centered: false,
    bgCenter: '/title/background_center.svg',
    bgLeft: '/title/background_left.svg',
    bgRight: '/title/background_right.svg',
    bgTranslucent: false,
    titleEnabled: true,
    focusBtn: {
        enabled: true,
        anchor: 'right' as const,
        x: 88,
        y: 4,
        up: '/title/focus_up.svg',
        over: '/title/focus_over.svg',
        down: '/title/focus_down.svg',
    },
    configBtn: {
        enabled: true,
        anchor: 'right' as const,
        x: 58,
        y: 4,
        up: '/title/config_up.svg',
        over: '/title/config_over.svg',
        down: '/title/config_down.svg',
    },
    quitBtn: {
        enabled: true,
        anchor: 'right' as const,
        x: 28,
        y: 4,
        up: '/title/quit_up.svg',
        over: '/title/quit_over.svg',
        down: '/title/quit_down.svg',
    },
}

export const DEFAULT_TABS_CONFIG = {
    tabsX: 36,
    tabsY: 0,
    selectedColor: DEFAULT_RGB_COLORS.text,
    unselectedColor: { r: 150, g: 150, b: 150 } as RgbColor,

    separatorImage: '/tabs/tab_separator.svg',
    selectedLeft: '/tabs/tab_selected_left.svg',
    selectedMiddle: '/tabs/tab_selected_middle.svg',
    selectedRight: '/tabs/tab_selected_right.svg',
    unselectedLeft: '/tabs/tab_unselected_left.svg',
    unselectedMiddle: '/tabs/tab_unselected_middle.svg',
    unselectedRight: '/tabs/tab_unselected_right.svg',

    preventClosingImage: '/tabs/lock.svg',
    preventClosingImageX: 0,
    preventClosingImageY: 8,
    selectedTextBold: true,
    compact: false,
    lockEnabled: true,

    bgCenter: '/tabs/background_center.svg',
    bgLeft: '/tabs/background_left.svg',
    bgRight: '/tabs/background_right.svg',
    bgTranslucent: false,

    tabsEnabled: true,

    plusBtn: {
        enabled: true,
        x: 2,
        y: 6,
        atEndOfTabs: false,
        up: '/tabs/plus_up.svg',
        over: '/tabs/plus_over.svg',
        down: '/tabs/plus_down.svg',
    },
    minusBtn: {
        enabled: true,
        x: 22,
        y: 6,
        up: '/tabs/minus_up.svg',
        over: '/tabs/minus_over.svg',
        down: '/tabs/minus_down.svg',
    },
    closeBtn: {
        enabled: true,
        x: 5,
        y: 5,
        up: '/tabs/close_up.svg',
        over: '/tabs/close_over.svg',
        down: '/tabs/close_down.svg',
    },
    lockBtn: {
        enabled: true,
        x: 0,
        y: 8,
        up: '/tabs/lock.svg',
        over: '/tabs/lock.svg',
        down: '/tabs/lock.svg',
    },
}

const DEFAULT_BUTTON_STATE = {
    upBg: '#232834',
    upIcon: '#66c2f2',
    overBg: '#3b4252',
    overIcon: '#66c2f2',
    downBg: '#66c2f2',
    downIcon: '#1e2233',
}

export const DEFAULT_BUTTON_COLORS: ButtonColors = {
    focus: { ...DEFAULT_BUTTON_STATE },
    config: { ...DEFAULT_BUTTON_STATE },
    quit: { ...DEFAULT_BUTTON_STATE, downBg: '#bf616a', downIcon: '#ffffff' },
    plus: { ...DEFAULT_BUTTON_STATE },
    minus: { ...DEFAULT_BUTTON_STATE },
    close: { ...DEFAULT_BUTTON_STATE },
}

export const createDefaultSkinConfig = (): SkinConfig => ({
    meta: DEFAULT_META,
    title: DEFAULT_TITLE_CONFIG,
    tabs: DEFAULT_TABS_CONFIG,
    global: {
        iconLibrary: 'lucide',
        iconSet: DEFAULT_ICON_SETS.lucide,
        colors: {
            bg: '#1e2233',
            selected: '#3b4252',
            text: '#66c2f2',
            dim: '#232834',
            konsoleBackground: deriveKonsoleBackground('#1e2233'),
        },
        buttonColors: DEFAULT_BUTTON_COLORS,
        borderRadius: 0,
        opacity: 100,
        translucency: false,
    },
})
