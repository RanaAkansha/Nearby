'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import useSWR from 'swr';
import { Trash2, LogOut } from 'lucide-react';

type Post = {
  id: string;
  title: string;
  category: string;
  description?: string;
  name: string;
  room: string;
  created_at: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      setAuthenticated(true);
    }
  }, [router]);

  const { data: posts, isLoading, error, mutate } = useSWR<Post[]>('/api/posts', fetcher);

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setDeletingId(postId);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        mutate(posts?.filter(p => p.id !== postId));
      } else {
        alert('Failed to delete post');
      }
    } catch (err) {
      alert('Error deleting post');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (!authenticated) return null;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-red-600 font-medium">Only admin have access to this page</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load posts</p>
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No posts to moderate</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="p-6 border border-slate-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-900 text-lg">{post.title}</h3>
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                        {post.category}
                      </span>
                    </div>

                    {post.description && (
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">{post.description}</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-500">Posted by:</span> {post.name}
                      </div>
                      <div>
                        <span className="text-slate-500">Room:</span> {post.room}
                      </div>
                      <div>
                        <span className="text-slate-500">Date:</span> {new Date(post.created_at).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="text-slate-500">Time:</span> {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleDeletePost(post.id)}
                    disabled={deletingId === post.id}
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deletingId === post.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
