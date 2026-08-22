import type { SkinConfig } from '../../types'

interface NavbarProps {
    config: SkinConfig
    activeTab: string
    onTabChange: (tab: string) => void
}

const NAV_TABS = [
    { id: 'global', label: 'Global' },
    { id: 'title', label: 'Title Bar' },
    { id: 'tabs', label: 'Tabs Bar' },
    { id: 'export', label: 'Export' },
    { id: 'meta', label: 'Metadata' },
] as const

const GITHUB_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
</svg>`

const GEN_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48" fill="none">
  <rect width="48" height="48" rx="10" fill="currentColor"/>
  <path d="M12 24 L20 32 L36 16" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="24" cy="24" r="5" fill="white"/>
</svg>`

export const Navbar = ({ config, activeTab, onTabChange }: NavbarProps) => {
    const accentColor = config.global.colors.text

    return (
        <nav
            className="mb-6 rounded-xl border border-[#1e293b] bg-[#121824] p-2 shadow-lg"
            style={{ borderColor: `${accentColor}40` }}
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 px-3">
                    <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{ backgroundColor: accentColor }}
                    >
                        <span dangerouslySetInnerHTML={{ __html: GEN_LOGO }} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">Yakuake Skin Generator</h1>
                        <p className="text-xs text-gray-400">Create custom terminal skins</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1" role="tablist">
                        {NAV_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`relative overflow-hidden rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                                    activeTab === tab.id
                                        ? 'text-white shadow-md'
                                        : 'text-gray-400 hover:text-gray-200'
                                }`}
                                style={{
                                    backgroundColor:
                                        activeTab === tab.id ? accentColor : 'transparent',
                                    borderColor: activeTab === tab.id ? accentColor : 'transparent',
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <a
                        href="https://github.com/sanguine6660/yakuake-skin-generator"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-2 transition-colors hover:bg-gray-800"
                        aria-label="GitHub Repository"
                    >
                        <span dangerouslySetInnerHTML={{ __html: GITHUB_LOGO }} />
                    </a>
                </div>
            </div>
        </nav>
    )
}
