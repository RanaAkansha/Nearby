'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  claimed_by?: string;
  claimed_at?: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MyPostsPage() {
  const [userName, setUserName] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
    }
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

  const myPosts = posts?.filter(p => p.name === userName) || [];
  const activePosts = myPosts.filter(p => !p.claimed);
  const claimedPosts = myPosts.filter(p => p.claimed);

  const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
    sell: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'For Sale' },
    free: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Free' },
    want: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Want' },
    lost: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Lost' },
    found: { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'Found' },
    announcement: { bg: 'bg-rose-50', text: 'text-rose-700', label: 'Announcement' },
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-6 sm:mb-8 hover:bg-slate-100 text-sm sm:text-base">
            ← Back to Nearby
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Posts</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">Manage all your listings</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading...</p>
          </div>
        ) : myPosts.length === 0 ? (
          <Card className="p-8 text-center border border-slate-100">
            <p className="text-slate-500 mb-4">No posts yet</p>
            <Link href="/new">
              <Button className="bg-purple-600 hover:bg-purple-700">Create Your First Post</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Active Posts */}
            {activePosts.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Active Posts ({activePosts.length})</h2>
                <div className="space-y-3">
                  {activePosts.map(post => (
                    <Card key={post.id} className="p-4 border border-slate-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-slate-900">{post.title}</h3>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${categoryColors[post.category]?.bg} ${categoryColors[post.category]?.text}`}>
                              {categoryColors[post.category]?.label}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600">{post.description}</p>
                          <div className="flex gap-4 mt-2 text-xs text-slate-500">
                            <span>Room {post.room}</span>
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            {post.price && <span>₹{post.price}</span>}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-col sm:flex-row">
                          <Link href={`/edit/${post.id}`}>
                            <Button size="sm" variant="outline" className="text-xs">
                              Edit
                            </Button>
                          </Link>
                          <Link href={`/posts/${post.id}`}>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Claimed Posts */}
            {claimedPosts.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Claimed Posts ({claimedPosts.length})</h2>
                <div className="space-y-3">
                  {claimedPosts.map(post => (
                    <Card key={post.id} className="p-4 border border-slate-100 bg-slate-50 opacity-75">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-slate-900">{post.title}</h3>
                            <span className="text-xs font-semibold px-2 py-1 rounded bg-green-50 text-green-700">
                              Claimed
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600">{post.description}</p>
                          <div className="flex gap-4 mt-2 text-xs text-slate-500">
                            <span>Claimed by {post.claimed_by}</span>
                            <span>{post.claimed_at ? new Date(post.claimed_at).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
