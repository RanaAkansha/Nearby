'use client';

import React from "react"
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Category = 'sell' | 'free' | 'lost' | 'found' | 'announcement' | 'want';

export function AddPostForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('sell');
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create post
      const postData: any = {
        title,
        description: description || null,
        category,
        name,
        room,
      };

      // Add category-specific fields
      if (category === 'sell' && price) {
        postData.price = parseFloat(price);
      }
      if (['sell', 'free', 'want'].includes(category) && quantity) {
        postData.quantity = parseInt(quantity);
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('sell');
      setName('');
      setRoom('');
      setPrice('');
      setQuantity('');

      router.refresh();
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const showPrice = category === 'sell';
  const showQuantity = category === 'sell' || category === 'free' || category === 'want';
  const showDescription = true;

  return (
    <Card className="p-4 sm:p-8 bg-white border border-slate-100 shadow-lg">
      {error && (
        <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm font-medium">
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
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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

        {/* Price - only for sell */}
        {showPrice && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Price (₹) {category === 'sell' && '*'}
            </label>
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 50"
              required={category === 'sell'}
            />
          </div>
        )}

        {/* Quantity - for sell and free */}
        {showQuantity && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Quantity
            </label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g., 2"
              min="1"
            />
          </div>
        )}

        {/* Description - optional for most, required for announcements */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description {category === 'announcement' ? '*' : '(optional)'}
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={category === 'announcement' ? 'Share your announcement...' : 'Add details about your item...'}
            required={category === 'announcement'}
            rows={3}
          />
        </div>

        {/* Your Name */}
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

        {/* Room/Address */}
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

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-75"
        >
          {loading ? 'Creating...' : 'Create Post'}
        </Button>
      </form>
    </Card>
  );
}
