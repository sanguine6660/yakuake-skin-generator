export type IconLibrary =
    | 'lucide'
    | 'fa'
    | 'fa6'
    | 'io'
    | 'io5'
    | 'md'
    | 'ti'
    | 'go'
    | 'fi'
    | 'gi'
    | 'wi'
    | 'di'
    | 'ai'
    | 'bs'
    | 'ri'
    | 'fc'
    | 'gr'
    | 'hi'
    | 'hi2'
    | 'si'
    | 'sl'
    | 'im'
    | 'bi'
    | 'cg'
    | 'vsc'
    | 'tb'
    | 'tfi'
    | 'pi'

export type IconRole = 'settings' | 'maximize' | 'close' | 'plus' | 'minus' | 'lock'

export interface IconSet {
    settings: string
    maximize: string
    close: string
    plus: string
    minus: string
    lock: string
}

export interface RgbColor {
    r: number
    g: number
    b: number
}

export interface SkinMeta {
    skinName: string
    author: string
    email: string
    web?: string
    icon: string
}

export interface TitleConfig {
    meta: SkinMeta

    borderColor: RgbColor
    borderWidth: number

    textX: number
    textY: number
    textColor: RgbColor
    textContent: string
    textBold: boolean

    bgCenter: string
    bgLeft: string
    bgRight: string
    bgTranslucent?: boolean

    focusBtnEnabled: boolean
    focusBtnX: number
    focusBtnY: number
    focusBtnUp: string
    focusBtnOver: string
    focusBtnDown: string

    configBtnEnabled: boolean
    configBtnX: number
    configBtnY: number
    configBtnUp: string
    configBtnOver: string
    configBtnDown: string

    quitBtnEnabled: boolean
    quitBtnX: number
    quitBtnY: number
    quitBtnUp: string
    quitBtnOver: string
    quitBtnDown: string
}

export interface TabsConfig {
    meta: SkinMeta

    tabsX: number
    tabsY: number
    selectedColor: RgbColor
    unselectedColor: RgbColor

    separatorImage?: string
    selectedLeft: string
    selectedMiddle: string
    selectedRight: string
    unselectedLeft: string
    unselectedMiddle: string
    unselectedRight: string

    preventClosingImage: string
    preventClosingX: number
    preventClosingY: number
    lockEnabled: boolean

    bgCenter: string
    bgLeft: string
    bgRight: string
    bgTranslucent?: boolean

    plusBtnEnabled: boolean
    plusBtnX: number
    plusBtnY: number
    plusBtnUp: string
    plusBtnOver: string
    plusBtnDown: string

    minusBtnEnabled: boolean
    minusBtnX: number
    minusBtnY: number
    minusBtnUp: string
    minusBtnOver: string
    minusBtnDown: string

    closeBtnEnabled: boolean
    closeBtnX: number
    closeBtnY: number
    closeBtnUp: string
    closeBtnOver: string
    closeBtnDown: string
}

export interface ButtonStateColors {
    upBg: string
    upIcon: string
    overBg: string
    overIcon: string
    downBg: string
    downIcon: string
}

export interface ButtonColors {
    focus: ButtonStateColors
    config: ButtonStateColors
    quit: ButtonStateColors
    plus: ButtonStateColors
    minus: ButtonStateColors
    close: ButtonStateColors
}

export interface SkinConfig {
    meta: SkinMeta
    title: Omit<TitleConfig, 'meta'>
    tabs: Omit<TabsConfig, 'meta'>
    global: {
        iconLibrary: IconLibrary
        iconSet: IconSet
        colors: {
            bg: string
            selected: string
            text: string
            dim: string
        }
        buttonColors: ButtonColors
        borderRadius: number
        opacity: number
        translucency: boolean
    }
}

export type ConfigSection = 'meta' | 'global' | 'title' | 'tabs'

export interface FormField {
    key: string
    label: string
    type: 'text' | 'number' | 'color' | 'select' | 'checkbox' | 'rgb-color'
    min?: number
    max?: number
    step?: number
    placeholder?: string
    options?: { value: string; label: string }[]
}
