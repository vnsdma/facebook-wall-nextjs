'use client';

import React, { useState } from 'react';
import { Database, ChevronDown, ChevronUp, Copy, Check, Image as ImageIcon } from 'lucide-react';

interface SupabaseSetupBannerProps {
  isConfigured: boolean;
  isRealtimeActive: boolean;
}

export const SupabaseSetupBanner: React.FC<SupabaseSetupBannerProps> = ({
  isConfigured,
  isRealtimeActive,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const sqlCode = `-- 1. Add image_url column to posts table
alter table public.posts add column if not exists image_url text;

-- 2. Create public storage bucket for wall-photos
insert into storage.buckets (id, name, public)
values ('wall-photos', 'wall-photos', true)
on conflict (id) do nothing;

-- 3. Set storage policies to allow public uploads and views
drop policy if exists "Allow public uploads" on storage.objects;
create policy "Allow public uploads" on storage.objects for insert with check (bucket_id = 'wall-photos');

drop policy if exists "Allow public view" on storage.objects;
create policy "Allow public view" on storage.objects for select using (bucket_id = 'wall-photos');

drop policy if exists "Allow public delete" on storage.objects;
create policy "Allow public delete" on storage.objects for delete using (bucket_id = 'wall-photos');`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#fff9e6] border border-[#ffe082] p-3 mb-4 text-xs text-[#5c4900] shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-600" />
          <span className="font-bold">
            {isConfigured && isRealtimeActive
              ? 'Connected to Supabase Realtime • Storage Photo Uploads Supported'
              : isConfigured
              ? 'Supabase configured • Ready for Photo Uploads'
              : 'Running in Local Mode (Offline Fallback)'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-[11px] font-bold text-[#3b5998] hover:underline"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{isOpen ? 'Hide Storage SQL Guide' : 'Storage SQL Migration'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-[#f0d479]">
          <p className="mb-2 text-[11px] leading-relaxed">
            To enable photo uploads directly to Supabase Storage, run this migration in your{' '}
            <a
              href="https://supabase.com/dashboard/project/ophomnrpkblmclzcmsbv/sql/new"
              target="_blank"
              rel="noreferrer"
              className="text-[#3b5998] font-bold underline"
            >
              Supabase SQL Editor
            </a>
            :
          </p>

          <div className="relative bg-[#1e1e1e] text-[#d4d4d4] p-3 font-mono text-[11px] overflow-x-auto border border-gray-700">
            <button
              type="button"
              onClick={handleCopy}
              className="absolute top-2 right-2 flex items-center gap-1 bg-[#333333] hover:bg-[#444444] text-white px-2 py-1 text-[10px] rounded transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-green-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy SQL</span>
                </>
              )}
            </button>
            <pre className="pr-16 whitespace-pre">{sqlCode}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
