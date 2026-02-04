'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
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
};

const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
  sell: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'For Sale' },
  free: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Free' },
  want: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Want' },
  lost: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Lost' },
  found: { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'Found' },
  announcement: { bg: 'bg-rose-50', text: 'text-rose-700', label: 'Announcement' },
};

export function PostCard({ post }: { post: Post }) {
  const colors = categoryColors[post.category];
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <Link href={`/posts/${post.id}`}>
      <Card className="overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer h-full flex flex-col bg-white border border-slate-100">
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
      </Card>
    </Link>
  );
}
