'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface HeaderBarProps {
  isRealtimeActive: boolean;
  isConfigured: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  isRealtimeActive,
  isConfigured,
}) => {
  return (
    <header className="w-full bg-[#3b5998] border-b border-[#29447e] text-white">
      <div className="max-w-5xl mx-auto px-4 h-11 flex items-center justify-between">
        {/* Brand & Search */}
        <div className="flex items-center gap-6">
          <a
            href="/"
            className="text-white text-2xl font-bold tracking-tighter lowercase font-serif hover:no-underline select-none"
          >
            facebook
          </a>

          <div className="hidden sm:flex items-center relative">
            <input
              type="text"
              placeholder="Search"
              aria-label="Search"
              className="bg-white text-black text-xs px-2 py-0.5 pr-6 w-44 rounded-none border border-[#1d2f53] focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-gray-500 absolute right-1.5 pointer-events-none" />
          </div>
        </div>

        {/* Navigation & Status */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <nav className="flex items-center gap-3">
            <span className="text-white font-bold cursor-pointer">Home</span>
            <span className="text-[#d8dfea] hover:text-white cursor-pointer">Profile</span>
            <span className="text-[#d8dfea] hover:text-white cursor-pointer">Friends</span>
            <span className="text-[#d8dfea] hover:text-white cursor-pointer">Inbox</span>
          </nav>

          {/* Database indicator */}
          <div className="flex items-center gap-1.5 pl-3 border-l border-[#526da4] text-[10px]">
            <span
              className={`w-2 h-2 rounded-full ${
                isRealtimeActive
                  ? 'bg-emerald-400 animate-pulse'
                  : isConfigured
                  ? 'bg-amber-300'
                  : 'bg-gray-300'
              }`}
            />
            <span className="text-[#eceff5]">
              {isRealtimeActive ? 'Realtime Live' : isConfigured ? 'Supabase Connected' : 'Local Preview'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
