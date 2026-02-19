'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Heart, Share2, MessageCircle } from 'lucide-react';
import useSWR from 'swr';

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
};

const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
  sell: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'For Sale' },
  free: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Free' },
  want: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Want' },
  lost: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Lost' },
  found: { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'Found' },
  announcement: { bg: 'bg-rose-50', text: 'text-rose-700', label: 'Announcement' },
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function PostCard({ post }: { post: Post }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('userName') || '';
    setUserId(id);
  }, []);

  const { data: favoritesData } = useSWR(
    userId ? `/api/favorites?userId=${userId}` : null,
    fetcher,
    { dedupingInterval: 5000 }
  );

  useEffect(() => {
    if (favoritesData?.favorites) {
      setIsSaved(favoritesData.favorites.includes(post.id));
    }
  }, [favoritesData, post.id]);
  
  const colors = categoryColors[post.category];
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/favorites', {
        method: isSaved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id }),
      });

      if (response.ok) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/posts/${post.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `Check out "${post.title}" on Nearby`,
          url: url,
        });
      } catch (error: any) {
        // If share is denied or fails, fall back to clipboard
        if (error.name !== 'AbortError') {
          try {
            await navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
          } catch {
            alert('Unable to share or copy link');
          }
        }
      }
    } else {
      // Fallback if navigator.share is not available
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch {
        alert('Unable to copy link to clipboard');
      }
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-200 h-full flex flex-col bg-white border border-slate-100 relative group">
      <Link href={`/posts/${post.id}`} className="contents">
        {post.image_url && (
          <div className="relative w-full h-40 bg-gradient-to-br from-slate-100 to-slate-200">
            <Image
              src={post.image_url || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-3">
            <Badge className={`${colors.bg} ${colors.text} text-xs font-semibold border-0 rounded-full px-2.5 py-0.5`}>
              {colors.label}
            </Badge>
            <span className="text-xs text-slate-400 whitespace-nowrap">{timeAgo}</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 text-sm leading-tight">{post.title}</h3>
          {post.price !== undefined && post.category === 'sell' && (
            <p className="text-sm font-bold text-purple-600 mb-1">₹{post.price}</p>
          )}
          {post.description && (
            <p className="text-sm text-slate-600 line-clamp-2 mb-auto">{post.description}</p>
          )}
          <div className="pt-3 border-t border-slate-100 mt-3">
            <p className="text-xs text-slate-500 font-medium">by {post.name} • Room {post.room}</p>
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex gap-2">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-slate-50"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isSaved ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-red-500'
            }`}
          />
        </Button>
        <Button
          onClick={handleShare}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Share2 className="w-5 h-5 text-slate-500 hover:text-purple-600" />
        </Button>
      </div>
    </Card>
  );
}
