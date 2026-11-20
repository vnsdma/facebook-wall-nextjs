'use client';

import React, { useState } from 'react';
import { Mail, Hand, Image, Users } from 'lucide-react';

export const ProfileCard: React.FC = () => {
  const [pokeCount, setPokeCount] = useState(0);
  const [poked, setPoked] = useState(false);

  const handlePoke = () => {
    setPokeCount((prev) => prev + 1);
    setPoked(true);
    setTimeout(() => setPoked(false), 2000);
  };

  return (
    <aside className="w-full sm:w-48 flex-shrink-0 space-y-3">
      {/* Profile Picture */}
      <div className="bg-white p-1 border border-[#d8dfea] shadow-sm">
        <div className="w-full aspect-[4/5] bg-gradient-to-b from-[#d8dfea] to-[#b0c0d8] flex flex-col items-center justify-center text-center p-3 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-white/80 border-2 border-[#3b5998] flex items-center justify-center text-2xl font-bold text-[#3b5998] mb-2 shadow-inner">
            👤
          </div>
          <span className="text-xs font-bold text-[#333333]">Mark Zuckerberg</span>
          <span className="text-[10px] text-[#555555]">Stanford / Harvard</span>
        </div>
      </div>

      {/* Action Links */}
      <div className="bg-white p-2.5 border border-[#d8dfea] shadow-sm text-xs space-y-1.5">
        <a href="#send-message" className="flex items-center gap-1.5 text-[#3b5998] hover:underline">
          <Mail className="w-3.5 h-3.5 text-[#6d84b4]" />
          <span>Send Message</span>
        </a>

        <button
          type="button"
          onClick={handlePoke}
          className="w-full flex items-center justify-between text-[#3b5998] hover:underline text-left bg-transparent p-0 border-none cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Hand className="w-3.5 h-3.5 text-[#6d84b4]" />
            <span>Poke Mark</span>
          </span>
          {pokeCount > 0 && (
            <span className="text-[10px] text-gray-500 font-mono">({pokeCount})</span>
          )}
        </button>
        {poked && (
          <p className="text-[10px] text-emerald-600 italic">You poked Mark!</p>
        )}

        <a href="#photos" className="flex items-center gap-1.5 text-[#3b5998] hover:underline">
          <Image className="w-3.5 h-3.5 text-[#6d84b4]" />
          <span>View Photos (24)</span>
        </a>

        <a href="#friends" className="flex items-center gap-1.5 text-[#3b5998] hover:underline">
          <Users className="w-3.5 h-3.5 text-[#6d84b4]" />
          <span>Mutual Friends (42)</span>
        </a>
      </div>

      {/* Information Box */}
      <div className="bg-white p-2.5 border border-[#d8dfea] shadow-sm text-[11px] space-y-1 text-[#333333]">
        <h3 className="font-bold text-[#3b5998] border-b border-[#eceff5] pb-1 mb-1.5 text-xs">
          Information
        </h3>
        <div>
          <span className="text-gray-500 block text-[10px]">Networks:</span>
          <span className="font-medium">Harvard Alum, Palo Alto</span>
        </div>
        <div>
          <span className="text-gray-500 block text-[10px]">Current City:</span>
          <span className="font-medium">Palo Alto, California</span>
        </div>
        <div>
          <span className="text-gray-500 block text-[10px]">Relationship:</span>
          <span className="font-medium">In a Relationship</span>
        </div>
        <div>
          <span className="text-gray-500 block text-[10px]">Birthday:</span>
          <span className="font-medium">May 14, 1984</span>
        </div>
      </div>
    </aside>
  );
};
