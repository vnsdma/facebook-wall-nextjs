'use client';

import React, { useState } from 'react';
import { Database, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface SupabaseSetupBannerProps {
  isConfigured: boolean;
  isRealtimeActive: boolean;
}

export const SupabaseSetupBanner: React.FC<SupabaseSetupBannerProps> = ({
  isConfigured,
  isRealtimeActive,
}) => {
  const [isOpen, setIsOpen] = useState(!isConfigured);
  const [copied, setCopied] = useState(false);

  const sqlCode = `create table posts (
  id uuid primary key default gen_random_uuid(),
  author_name text default 'Guest',
  body text check (char_length(body) <= 280),
  created_at timestamptz default now()
);

-- Enable Realtime
alter publication supabase_realtime add table posts;

-- Enable Public Read & Insert
alter table posts enable row level security;
create policy "Public posts are viewable by everyone" on posts for select using (true);
create policy "Anyone can insert a post" on posts for insert with check (true);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isConfigured && isRealtimeActive) {
    return null;
  }

  return (
    <div className="bg-[#fff9e6] border border-[#ffe082] p-3 mb-4 text-xs text-[#5c4900] shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-600" />
          <span className="font-bold">
            {isConfigured
              ? 'Supabase configured — Connecting to Realtime channel...'
              : 'Running in Local Mode (Offline Fallback)'}
          </span>
        </div>
        {!isConfigured && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-[11px] font-bold text-[#3b5998] hover:underline"
          >
            <span>{isOpen ? 'Hide Supabase setup guide' : 'Show Supabase SQL & setup guide'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {isOpen && !isConfigured && (
        <div className="mt-3 pt-3 border-t border-[#ffe082] space-y-2">
          <p className="text-[11px] leading-relaxed">
            Posts are currently saved locally in your browser. To connect cloud storage and enable multi-browser real-time updates as required by the test:
          </p>

          <ol className="list-decimal list-inside space-y-1 text-[11px]">
            <li>Create a free project at <strong className="text-amber-900">supabase.com</strong>.</li>
            <li>In Supabase <strong>SQL Editor</strong>, run the snippet below.</li>
            <li>Add <code className="bg-amber-100 px-1 py-0.5 font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 py-0.5 font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your Vercel project environment variables.</li>
          </ol>

          <div className="relative mt-2">
            <pre className="bg-[#2d3139] text-[#e2e8f0] p-2.5 rounded text-[10px] font-mono overflow-x-auto max-h-36">
              {sqlCode}
            </pre>
            <button
              type="button"
              onClick={handleCopy}
              className="absolute top-2 right-2 px-2 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-[10px] flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy SQL'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
