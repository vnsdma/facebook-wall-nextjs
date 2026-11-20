'use client';

import React, { useState } from 'react';
import { WallPost } from '../types/wall';
import { formatFbTimestamp } from '../lib/dateFormat';
import { ThumbsUp, Trash2 } from 'lucide-react';

interface WallPostItemProps {
  post: WallPost;
  onDelete?: (id: string) => void;
}

export const WallPostItem: React.FC<WallPostItemProps> = ({
  post,
  onDelete,
}) => {
  const [likes, setLikes] = useState(post.likes_count || 0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleToggleLike = () => {
    if (hasLiked) {
      setLikes((prev) => Math.max(0, prev - 1));
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <article className="border-b border-[#eceff5] py-3.5 px-3 hover:bg-[#fafbfc] transition-colors">
      <div className="flex items-start gap-2.5">
        {/* Avatar */}
        <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-tr from-[#6d84b4] to-[#3b5998] flex items-center justify-center text-white font-bold text-xs shadow-sm border border-[#2f477a]">
          {post.author_name.charAt(0).toUpperCase()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between mb-1">
            <div className="text-xs">
              <span className="font-bold text-[#3b5998] hover:underline cursor-pointer">
                {post.author_name}
              </span>
              <span className="text-gray-500 text-[11px] ml-1">wrote on your Wall:</span>
            </div>
            <time className="text-[10px] text-gray-500 whitespace-nowrap" dateTime={post.created_at}>
              {formatFbTimestamp(post.created_at)}
            </time>
          </div>

          {/* Body */}
          <p className="text-xs text-[#222222] whitespace-pre-wrap break-words leading-relaxed mb-2">
            {post.body}
          </p>

          {/* Actions Bar */}
          <div className="flex items-center gap-3 text-[10px] text-[#3b5998]">
            <button
              type="button"
              onClick={handleToggleLike}
              className={`flex items-center gap-1 hover:underline bg-transparent border-none p-0 cursor-pointer ${
                hasLiked ? 'font-bold text-[#3b5998]' : 'text-[#3b5998]'
              }`}
            >
              <ThumbsUp className="w-3 h-3" />
              <span>{hasLiked ? 'Liked' : 'Like'}</span>
              {likes > 0 && <span className="text-gray-600 font-mono">({likes})</span>}
            </button>

            <span className="text-gray-300">•</span>

            <button
              type="button"
              onClick={() => {
                alert(`Comment feature: reply posted to ${post.author_name}'s Wall!`);
              }}
              className="hover:underline bg-transparent border-none p-0 cursor-pointer text-[#3b5998]"
            >
              Write on {post.author_name}&apos;s Wall
            </button>

            {onDelete && (
              <>
                <span className="text-gray-300">•</span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Delete this wall post?')) {
                      onDelete(post.id);
                    }
                  }}
                  className="hover:underline text-gray-400 hover:text-red-600 bg-transparent border-none p-0 cursor-pointer flex items-center gap-0.5"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
