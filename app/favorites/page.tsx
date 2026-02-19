'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PostCard } from '@/components/post-card';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';

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

export default function FavoritesPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | Post['category']>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    setMounted(true);
    const id = localStorage.getItem('userName') || '';
    setUserId(id);
  }, []);

  const { data: allPosts, isLoading: postsLoading } = useSWR<Post[]>(
    mounted ? '/api/posts' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  const { data: favoritesData, isLoading: favoritesLoading } = useSWR(
    mounted && userId ? `/api/favorites?userId=${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  if (!mounted) return null;

  const favoriteIds = new Set(favoritesData?.favorites || []);
  let favoritePosts = allPosts?.filter(p => favoriteIds.has(p.id) && !p.claimed) || [];

  // Filter by category
  if (selectedCategory !== 'all') {
    favoritePosts = favoritePosts.filter(p => p.category === selectedCategory);
  }

  // Sort posts
  favoritePosts = [...favoritePosts].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const isLoading = postsLoading || favoritesLoading;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-6 sm:mb-8 hover:bg-slate-100 text-sm sm:text-base">
            ← Back to Nearby
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Saved Items</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">Your favorite posts and items</p>
        </div>

        {/* Filter and Sort */}
        {favoritePosts.length > 0 && (
          <div className="mb-6 flex gap-2 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
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
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading...</p>
          </div>
        ) : favoritePosts.length === 0 ? (
          <Card className="p-8 text-center border border-slate-100">
            <p className="text-slate-500 mb-4">No saved items yet</p>
            <Link href="/">
              <Button className="bg-purple-600 hover:bg-purple-700">Browse Items</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {favoritePosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
