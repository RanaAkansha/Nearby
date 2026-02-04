'use client';

import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/post-card';
import { AnnouncementCard } from '@/components/announcement-card';
import { LostFoundBell } from '@/components/lost-found-bell';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';

type Category = 'all' | 'sell' | 'free' | 'lost' | 'found' | 'announcement' | 'want';

type Post = {
  id: string;
  title: string;
  category: 'sell' | 'free' | 'lost' | 'found' | 'announcement' | 'want';
  description?: string;
  price?: number;
  quantity?: number;
  image_url?: string;
  created_at: string;
  name: string;
  room: string;
  claimed?: boolean;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: posts, isLoading, error } = useSWR<Post[]>(mounted ? '/api/posts' : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  if (!mounted) return null;

  // Separate posts by category and filter out claimed items
  const announcements = posts?.filter(p => p.category === 'announcement' && !p.claimed) || [];
  const marketplace = posts?.filter(p => ['sell', 'free', 'want'].includes(p.category) && !p.claimed) || [];
  const lostFound = posts?.filter(p => ['lost', 'found'].includes(p.category) && !p.claimed) || [];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Nearby</h1>
          <div className="flex items-center gap-1 sm:gap-2">
            <LostFoundBell lostFoundCount={lostFound.length} items={lostFound} />
            <Link href="/new">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm">
                + Post
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button size="sm" variant="ghost" className="text-xs text-slate-500 hover:text-slate-700 hidden sm:block">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading...</p>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Announcements Section - Smaller */}
            {announcements.length > 0 && (
              <section className="mb-8 sm:mb-10">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notices</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                  {announcements.slice(0, 4).map((post) => (
                    <AnnouncementCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* Marketplace Section */}
            <section className="mb-8 sm:mb-12">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Marketplace</h2>
              </div>
              {marketplace.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {marketplace.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 bg-white rounded-lg border border-slate-100">
                  <p className="text-slate-500 text-sm sm:text-base">Nothing found</p>
                </div>
              )}
            </section>

            {!isLoading && posts && posts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">No posts yet</p>
                <p className="text-slate-500 text-sm">Be the first to create one!</p>
              </div>
            )}
          </>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load posts</p>
          </div>
        )}
      </div>
    </main>
  );
}
