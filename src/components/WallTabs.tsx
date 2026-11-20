'use client';

import React from 'react';

interface WallTabsProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  postCount: number;
}

export const WallTabs: React.FC<WallTabsProps> = ({
  activeTab,
  onSelectTab,
  postCount,
}) => {
  const tabs = [
    { id: 'wall', label: `Wall (${postCount})` },
    { id: 'info', label: 'Info' },
    { id: 'photos', label: 'Photos (24)' },
    { id: 'boxes', label: 'Boxes' },
  ];

  return (
    <nav aria-label="Profile navigation" className="border-b border-[#3b5998] flex items-end gap-1 mb-3">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`px-3 py-1.5 text-xs font-bold transition-colors border-t border-x ${
              isActive
                ? 'bg-white text-[#3b5998] border-[#3b5998] border-b-2 border-b-white -mb-[1px]'
                : 'bg-[#eceff5] text-[#3b5998] border-[#d8dfea] hover:bg-[#d8dfea]'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};
