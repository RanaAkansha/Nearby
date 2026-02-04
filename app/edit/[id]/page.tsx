'use client';

import React from "react"

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

type Category = 'sell' | 'free' | 'lost' | 'found' | 'announcement' | 'want';

type Post = {
  id: string;
  title: string;
  description?: string;
  category: Category;
  name: string;
  room: string;
  price?: number;
  quantity?: number;
};

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('sell');
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        const data = await response.json();
        setPost(data);
        setTitle(data.title);
        setDescription(data.description || '');
        setCategory(data.category);
        setName(data.name);
        setRoom(data.room);
        setPrice(data.price || '');
        setQuantity(data.quantity || '');
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const postData: any = {
        title,
        description: description || null,
        category,
        name,
        room,
      };

      if (category === 'sell' && price) {
        postData.price = parseFloat(price);
      }

      if ((category === 'sell' || category === 'free') && quantity) {
        postData.quantity = quantity;
      }

      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error('Failed to update post');
      router.push(`/posts/${params.id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
          <p className="text-slate-600">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <Link href={`/posts/${params.id}`}>
          <Button variant="ghost" className="mb-6 sm:mb-8 hover:bg-slate-100 transition-colors text-sm sm:text-base">
            ← Back to Post
          </Button>
        </Link>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Edit Post</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">Update your post details</p>
        </div>

        <Card className="p-4 sm:p-8 bg-white border border-slate-100 shadow-lg">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="sell">For Sale</option>
                <option value="free">Free</option>
                <option value="want">Want</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title *
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Keep it short"
                required
              />
            </div>

            {/* Description */}
            {category !== 'announcement' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details about your item"
                  rows={4}
                />
              </div>
            )}

            {category === 'announcement' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Announcement details"
                  rows={4}
                  required
                />
              </div>
            )}

            {/* Price - for sell only */}
            {category === 'sell' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price (₹) *
                </label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            )}

            {/* Quantity - for sell, free, and want */}
            {(category === 'sell' || category === 'free' || category === 'want') && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Quantity
                </label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1"
                />
              </div>
            )}

            {/* Room */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Room/Address *
              </label>
              <Input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="A/G/2/5"
                required
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Name *
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Akansha Rana"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-75"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
