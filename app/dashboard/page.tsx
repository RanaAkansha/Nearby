'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: posts, isLoading } = useSWR<Post[]>(
    mounted ? '/api/posts' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  if (!mounted) return null;

  const totalPosts = posts?.length || 0;
  const activePosts = posts?.filter(p => !p.claimed).length || 0;
  const claimedPosts = posts?.filter(p => p.claimed).length || 0;

  const categoryStats = posts?.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const categoryLabels: Record<string, string> = {
    sell: 'For Sale',
    free: 'Free',
    want: 'Want',
    lost: 'Lost',
    found: 'Found',
    announcement: 'Announcements',
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-6 sm:mb-8 hover:bg-slate-100 text-sm sm:text-base">
            ← Back to Nearby
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Community Dashboard</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">Quick overview of your community</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-6 border border-slate-100">
                <p className="text-sm text-slate-600 font-medium mb-1">Total Posts</p>
                <p className="text-3xl font-bold text-slate-900">{totalPosts}</p>
              </Card>
              <Card className="p-6 border border-slate-100">
                <p className="text-sm text-slate-600 font-medium mb-1">Active Posts</p>
                <p className="text-3xl font-bold text-purple-600">{activePosts}</p>
              </Card>
              <Card className="p-6 border border-slate-100">
                <p className="text-sm text-slate-600 font-medium mb-1">Claimed Items</p>
                <p className="text-3xl font-bold text-green-600">{claimedPosts}</p>
              </Card>
            </div>

            {/* Category Breakdown */}
            <Card className="p-6 border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Posts by Category</h2>
              <div className="space-y-3">
                {Object.entries(categoryStats).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">{categoryLabels[category]}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-40 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${(count / totalPosts) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-900 w-12 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Links */}
            <Card className="p-6 border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Links</h2>
              <div className="flex flex-wrap gap-3">
                <Link href="/my-posts">
                  <Button className="bg-purple-600 hover:bg-purple-700">My Posts</Button>
                </Link>
                <Link href="/favorites">
                  <Button variant="outline">Saved Items</Button>
                </Link>
                <Link href="/new">
                  <Button variant="outline">Create Post</Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
