'use client';

import React from 'react';
import { WallPost } from '../types/wall';
import { WallPostItem } from './WallPostItem';
import { MessageSquare } from 'lucide-react';

interface WallFeedProps {
  posts: WallPost[];
  isLoading: boolean;
  onDeletePost?: (id: string) => void;
}

export const WallFeed: React.FC<WallFeedProps> = ({
  posts,
  isLoading,
  onDeletePost,
}) => {
  return (
    <div className="bg-white border border-[#d8dfea] shadow-sm">
      {/* Feed Header */}
      <div className="bg-[#eceff5] px-3 py-1.5 border-b border-[#d8dfea] flex items-center justify-between">
        <span className="text-xs font-bold text-[#3b5998]">
          The Wall ({posts.length})
        </span>
        <span className="text-[10px] text-gray-500">
          Showing newest posts first
        </span>
      </div>

      {/* Posts List */}
      <div className="divide-y divide-[#eceff5]">
        {isLoading && posts.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500">
            Loading Wall posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-xs text-gray-600 font-semibold">
              No posts on this Wall yet.
            </p>
            <p className="text-[11px] text-gray-400">
              Be the first to write something using the box above!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <WallPostItem
              key={post.id}
              post={post}
              onDelete={onDeletePost}
            />
          ))
        )}
      </div>
    </div>
  );
};
