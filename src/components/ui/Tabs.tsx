interface Tab {
    id: string
    label: string
    icon?: string
}

interface TabsProps {
    tabs: Tab[]
    activeTab: string
    onChange: (tabId: string) => void
    className?: string
}

export const Tabs = ({ tabs, activeTab, onChange, className = '' }: TabsProps) => {
    return (
        <div className={className}>
            <div className="mb-4 flex border-b border-[#1e293b]">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onChange(tab.id)}
                        className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === tab.id
                                ? 'border-sky-400 text-white'
                                : 'border-transparent text-gray-400 hover:border-gray-700 hover:text-gray-200'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

interface TabPanelProps {
    activeTab: string
    tabId: string
    children: React.ReactNode
}

export const TabPanel = ({ activeTab, tabId, children }: TabPanelProps) => {
    if (activeTab !== tabId) return null
    return <div>{children}</div>
}
