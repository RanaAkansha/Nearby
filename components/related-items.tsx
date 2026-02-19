'use client';

import { PostCard } from './post-card';
import useSWR from 'swr';
import { Card } from './ui/card';
import Link from 'next/link';
import { Button } from './ui/button';

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

export function RelatedItems({ currentPost }: { currentPost: Post }) {
  const { data: allPosts } = useSWR<Post[]>('/api/posts', fetcher, {
    dedupingInterval: 5000,
  });

  // Find related posts based on category and not claimed
  const relatedPosts =
    allPosts
      ?.filter(
        (p) =>
          p.id !== currentPost.id &&
          p.category === currentPost.category &&
          !p.claimed
      )
      .slice(0, 3) || [];

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Similar Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
