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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: posts, isLoading, error } = useSWR<Post[]>(mounted ? '/api/posts' : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  if (!mounted) return null;

  // Filter posts based on search query and category
  const filteredPosts = posts?.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.room.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    
    return matchesSearch && matchesCategory && !p.claimed;
  }) || [];

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Separate posts by category and filter out claimed items
  const announcements = sortedPosts.filter(p => p.category === 'announcement') || [];
  const marketplace = sortedPosts.filter(p => ['sell', 'free', 'want'].includes(p.category)) || [];
  const lostFound = sortedPosts.filter(p => ['lost', 'found'].includes(p.category)) || [];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Nearby</h1>
          <div className="flex items-center gap-1 sm:gap-2">
            <LostFoundBell lostFoundCount={lostFound.length} items={lostFound} />
            <Link href="/favorites">
              <Button size="sm" variant="outline" className="text-xs sm:text-sm hidden sm:flex">
                ♥ Saved
              </Button>
            </Link>
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
        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-3">
          <input
            type="text"
            placeholder="Search by title, description, name, or room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          
          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Category)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
            >
              <option value="all">All Categories</option>
              <option value="sell">For Sale</option>
              <option value="free">Free</option>
              <option value="want">Want</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
              <option value="announcement">Announcements</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            <Link href="/my-posts">
              <Button size="sm" variant="outline" className="text-xs sm:text-sm">
                My Posts
              </Button>
            </Link>
          </div>
        </div>

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
