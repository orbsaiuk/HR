'use client';

import { useState } from 'react';

export function Tabs({ tabs, defaultTab = 0 }) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    return (
        <div>
            <div className="flex border-b border-gray-200">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        disabled={tab.disabled}
                        className={`
                            px-4 py-2 font-medium transition-colors
                            ${activeTab === index
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }
                            ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="mt-4">
                {tabs[activeTab]?.content}
            </div>
        </div>
    );
}
