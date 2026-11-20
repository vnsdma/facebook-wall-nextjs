'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { WallPost } from '../types/wall';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { HeaderBar } from '../components/HeaderBar';
import { ProfileCard } from '../components/ProfileCard';
import { WallTabs } from '../components/WallTabs';
import { WallComposer } from '../components/WallComposer';
import { WallFeed } from '../components/WallFeed';
import { SupabaseSetupBanner } from '../components/SupabaseSetupBanner';

const DEFAULT_POSTS: WallPost[] = [
  {
    id: 'seed-1',
    author_name: 'Dustin Moskovitz',
    body: 'Hey Mark, server cluster in San Jose is running smoothly. Ready to push the update.',
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    likes_count: 3,
  },
  {
    id: 'seed-2',
    author_name: 'Eduardo Saverin',
    body: 'Are we still meeting up with the new advertisers at 4pm?',
    created_at: new Date(Date.now() - 1000 * 60 * 125).toISOString(),
    likes_count: 1,
  },
  {
    id: 'seed-3',
    author_name: 'Chris Hughes',
    body: 'Welcome to my new Wall! Leave a message or write something here.',
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    likes_count: 5,
  },
];

export default function FacebookWallPage() {
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  const [activeTab, setActiveTab] = useState('wall');
  const [userStatus, setUserStatus] = useState('is building apps on the quad.');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusInput, setStatusInput] = useState(userStatus);

  // Load initial posts
  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (!error && data) {
          setPosts(data as WallPost[]);
          return;
        }
      }

      // Fallback: Local storage
      const saved = localStorage.getItem('fb_wall_posts_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPosts(parsed);
            return;
          }
        } catch {
          // ignore parsing error
        }
      }

      // Seed default initial posts
      setPosts(DEFAULT_POSTS);
      localStorage.setItem('fb_wall_posts_v1', JSON.stringify(DEFAULT_POSTS));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Set up Supabase Realtime Subscription
  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return;

    const channel = client
      .channel('public:posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          const newPost = payload.new as WallPost;
          setPosts((prev) => {
            if (prev.some((p) => p.id === newPost.id)) {
              return prev;
            }
            return [newPost, ...prev];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'posts' },
        (payload) => {
          const deletedId = payload.old.id;
          setPosts((prev) => prev.filter((p) => p.id !== deletedId));
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsRealtimeActive(true);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setIsRealtimeActive(false);
        }
      });

    return () => {
      client.removeChannel(channel);
      setIsRealtimeActive(false);
    };
  }, []);

  // Handle post creation
  const handleCreatePost = async (body: string, authorName: string): Promise<boolean> => {
    setIsPosting(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('posts')
          .insert({
            body,
            author_name: authorName,
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase insert error:', error);
          alert(`Failed to save to Supabase: ${error.message}`);
          return false;
        }

        if (data) {
          setPosts((prev) => {
            if (prev.some((p) => p.id === data.id)) return prev;
            return [data as WallPost, ...prev];
          });
        }
        return true;
      }

      // Offline / Local fallback
      const newPost: WallPost = {
        id: `local-${Date.now()}`,
        author_name: authorName,
        body,
        created_at: new Date().toISOString(),
        likes_count: 0,
      };

      const updated = [newPost, ...posts];
      setPosts(updated);
      localStorage.setItem('fb_wall_posts_v1', JSON.stringify(updated));
      return true;
    } finally {
      setIsPosting(false);
    }
  };

  // Handle post deletion
  const handleDeletePost = async (id: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) {
        alert(`Failed to delete: ${error.message}`);
        return;
      }
    }

    setPosts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem('fb_wall_posts_v1', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#333333] flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <HeaderBar
          isRealtimeActive={isRealtimeActive}
          isConfigured={isSupabaseConfigured}
        />

        {/* Main Workspace Canvas */}
        <main className="max-w-5xl mx-auto px-4 py-4 w-full">
          {/* Supabase Connection Guide Banner */}
          <SupabaseSetupBanner
            isConfigured={isSupabaseConfigured}
            isRealtimeActive={isRealtimeActive}
          />

          {/* Profile Name Header */}
          <div className="border-b border-[#d8dfea] pb-2 mb-3">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <h1 className="text-xl font-bold text-[#3b5998] font-sans">
                  Mark Zuckerberg
                </h1>
                {isEditingStatus ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setUserStatus(statusInput);
                      setIsEditingStatus(false);
                    }}
                    className="flex items-center gap-1.5"
                  >
                    <input
                      type="text"
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value)}
                      className="text-xs px-1.5 py-0.5 border border-[#bdc7d8] focus:outline-none"
                    />
                    <button type="submit" className="fb-btn-primary text-[10px] py-0.5 px-2">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingStatus(false)}
                      className="text-[10px] text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <span className="text-xs text-gray-600 italic">
                    {userStatus}{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setStatusInput(userStatus);
                        setIsEditingStatus(true);
                      }}
                      className="text-[10px] text-[#3b5998] not-italic hover:underline ml-1"
                    >
                      (edit)
                    </button>
                  </span>
                )}
              </div>

              <span className="text-xs text-gray-500 hidden sm:inline">
                Palo Alto, CA
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <WallTabs
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            postCount={posts.length}
          />

          {/* Two-Column Layout */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Left Column: Profile Card */}
            <ProfileCard />

            {/* Right Column: Wall Content */}
            <div className="flex-1 w-full min-w-0">
              {activeTab === 'wall' ? (
                <>
                  <WallComposer
                    onPostCreated={handleCreatePost}
                    isPosting={isPosting}
                  />

                  <WallFeed
                    posts={posts}
                    isLoading={isLoading}
                    onDeletePost={handleDeletePost}
                  />
                </>
              ) : (
                <div className="bg-white border border-[#d8dfea] p-8 text-center text-xs text-gray-500">
                  <p className="font-semibold text-gray-700 mb-1">
                    {activeTab.toUpperCase()} Section
                  </p>
                  <p>
                    Switch back to the <strong className="text-[#3b5998] cursor-pointer" onClick={() => setActiveTab('wall')}>Wall tab</strong> to test posting and live updates!
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Classic 2008 Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-6 w-full text-[11px] text-[#3b5998] border-t border-[#d8dfea] mt-8 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <a href="#about" className="hover:underline">About</a>
          <span className="text-gray-300">•</span>
          <a href="#developers" className="hover:underline">Developers</a>
          <span className="text-gray-300">•</span>
          <a href="#careers" className="hover:underline">Careers</a>
          <span className="text-gray-300">•</span>
          <a href="#privacy" className="hover:underline">Privacy</a>
          <span className="text-gray-300">•</span>
          <a href="#terms" className="hover:underline">Terms</a>
        </div>
        <div className="text-gray-500 text-[10px]">
          Facebook © 2008 • Built for Test 2: My Wall Challenge
        </div>
      </footer>
    </div>
  );
}
