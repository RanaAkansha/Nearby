'use client';

import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

type Post = {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  name: string;
  room: string;
};

export function AnnouncementCard({ post }: { post: Post }) {
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <Link href={`/posts/${post.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer bg-purple-600 text-white border-0 hover:bg-purple-700">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="text-2xl">📢</div>
            <span className="text-xs text-purple-100">{timeAgo}</span>
          </div>
          <h3 className="font-bold text-lg mb-3 line-clamp-2 italic">"{post.title}"</h3>
          {post.description && (
            <p className="text-sm text-purple-100 line-clamp-2 mb-4">{post.description}</p>
          )}
          <div className="flex items-center justify-between">
            <p className="text-xs text-purple-100">📍 {post.room}</p>
            <p className="text-xs text-purple-100 font-medium">— {post.name}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
