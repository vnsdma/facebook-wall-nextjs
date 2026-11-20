'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Loader2 } from 'lucide-react';

interface WallComposerProps {
  onPostCreated: (body: string, authorName: string) => Promise<boolean>;
  isPosting: boolean;
}

const MAX_CHARS = 280;

export const WallComposer: React.FC<WallComposerProps> = ({
  onPostCreated,
  isPosting,
}) => {
  const [body, setBody] = useState('');
  const [authorName, setAuthorName] = useState('');

  const charsLeft = MAX_CHARS - body.length;
  const isOverLimit = charsLeft < 0;
  const canSubmit = body.trim().length > 0 && !isOverLimit && !isPosting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const trimmedBody = body.trim();
    const finalAuthor = authorName.trim() || 'Guest';

    const success = await onPostCreated(trimmedBody, finalAuthor);
    if (success) {
      setBody('');
    }
  };

  return (
    <div className="bg-white border border-[#d8dfea] shadow-sm mb-4">
      {/* Box Header */}
      <div className="bg-[#eceff5] px-3 py-1.5 border-b border-[#d8dfea] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#3b5998]">
          <MessageSquare className="w-3.5 h-3.5 text-[#3b5998]" />
          <span>Write on Mark&apos;s Wall</span>
        </div>
        <span className="text-[10px] text-gray-500">
          Max {MAX_CHARS} characters
        </span>
      </div>

      {/* Composer Form */}
      <form onSubmit={handleSubmit} className="p-3">
        {/* Author Name Input */}
        <div className="flex items-center gap-2 mb-2 text-xs">
          <label htmlFor="author-name" className="text-gray-600 font-semibold text-[11px] whitespace-nowrap">
            Your Name:
          </label>
          <input
            id="author-name"
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="e.g. Eduardo, Dustin, or Guest"
            maxLength={40}
            className="text-xs px-2 py-1 border border-[#bdc7d8] rounded-none focus:outline-none focus:border-[#3b5998] w-48 bg-[#fdfdfd]"
          />
        </div>

        {/* Message Textarea */}
        <div className="relative mb-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write something..."
            rows={3}
            aria-label="Wall message text"
            className="w-full text-xs p-2 border border-[#bdc7d8] rounded-none focus:outline-none focus:border-[#3b5998] resize-none bg-[#fdfdfd] placeholder:text-gray-400"
          />
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-1">
          <span
            className={`text-[11px] font-mono ${
              isOverLimit ? 'text-red-600 font-bold' : charsLeft <= 20 ? 'text-amber-600 font-semibold' : 'text-gray-500'
            }`}
          >
            {charsLeft} character{charsLeft === 1 ? '' : 's'} remaining
          </span>

          <button
            type="submit"
            disabled={!canSubmit}
            className="fb-btn-primary flex items-center gap-1.5"
          >
            {isPosting ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Sharing...</span>
              </>
            ) : (
              <>
                <Send className="w-3 h-3" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
