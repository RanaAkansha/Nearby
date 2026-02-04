'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

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
  claimed: boolean;
  claimed_by?: string;
  claimed_at?: string;
};

const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
  sell: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'For Sale' },
  free: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Free' },
  want: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Want' },
  lost: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Lost' },
  found: { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'Found' },
  announcement: { bg: 'bg-rose-50', text: 'text-rose-700', label: 'Announcement' },
};

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [deleting, setDeleting] = useState(false); // Declare setDeleting variable

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  const handleClaim = async () => {
    if (!confirm('Mark this item as claimed?')) return;

    setClaiming(true);
    try {
      const response = await fetch(`/api/posts/${params.id}/claim`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to claim item');
      router.push('/');
    } catch (error) {
      console.error('Error claiming item:', error);
      alert('Failed to claim item');
    } finally {
      setClaiming(false);
    }
  };

  const handleEdit = () => {
    router.push(`/edit/${params.id}`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');
      router.push('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <p className="text-slate-600 text-center">Loading...</p>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Link href="/">
            <Button variant="ghost" className="mb-8 hover:bg-slate-100 transition-colors">
              ← Back to Board
            </Button>
          </Link>
          <Card className="p-12 text-center border border-slate-100 shadow-lg">
            <p className="text-slate-600 text-lg mb-6">Post not found</p>
            <Link href="/">
              <Button className="bg-purple-600 hover:bg-purple-700">Return to Feed</Button>
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  const colors = categoryColors[post.category];
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8 hover:bg-slate-100 transition-colors">
            ← Back to Board
          </Button>
        </Link>

        <Card className="overflow-hidden border border-slate-100 shadow-xl">
          {post.image_url && (
            <div className="relative w-full h-80 bg-slate-100">
              <Image
                src={post.image_url || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex items-start justify-between mb-6 gap-4">
              <Badge className={`${colors.bg} ${colors.text} text-sm font-semibold border-0 rounded-full px-3 py-1`}>
                {colors.label}
              </Badge>
              <span className="text-sm text-slate-400 whitespace-nowrap">{timeAgo}</span>
            </div>

            <h1 className="text-4xl font-bold text-slate-900 mb-6 text-balance">{post.title}</h1>

            {post.price !== undefined && post.category === 'sell' && (
              <div className="mb-4 text-2xl font-bold text-purple-600">₹{post.price}</div>
            )}

            {post.quantity && (
              <div className="mb-4 text-sm text-slate-600">
                <span className="font-semibold">Quantity:</span> {post.quantity}
              </div>
            )}

            {post.description && (
              <div className="mb-8 pb-8 border-b border-slate-200">
                <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">{post.description}</p>
              </div>
            )}

            <div className="bg-slate-100 p-6 rounded-lg border border-slate-200 mb-8">
              <p className="text-sm text-slate-700">
                Posted by <span className="font-bold text-slate-900">{post.name}</span> • Room {post.room}
              </p>
              <p className="text-xs text-slate-500 mt-2">{new Date(post.created_at).toLocaleString()}</p>
            </div>

            {!post.claimed && (
              <div className="flex gap-3">
                <Button
                  onClick={handleEdit}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Edit Post
                </Button>
                <Button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {claiming ? 'Marking...' : 'Mark as Claimed'}
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {deleting ? 'Deleting...' : 'Delete Post'}
                </Button>
              </div>
            )}

            {post.claimed && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-semibold">✓ Marked as Claimed</p>
                <p className="text-sm text-green-600 mt-1">
                  Claimed by {post.claimed_by} on {post.claimed_at ? new Date(post.claimed_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
