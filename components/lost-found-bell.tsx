'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

type Post = {
  id: string;
  title: string;
  category: 'lost' | 'found';
  room: string;
  name: string;
  created_at: string;
};

export function LostFoundBell({ lostFoundCount, items }: { lostFoundCount: number; items: Post[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative border-2 border-purple-300 hover:bg-purple-50 transition-colors bg-transparent"
      >
        <Bell className="w-5 h-5 text-purple-600" />
        {lostFoundCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {lostFoundCount}
          </span>
        )}
      </Button>

      {/* Dropdown Modal */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg border border-slate-200 shadow-xl z-50 max-h-96 overflow-y-auto">
          {items.length > 0 ? (
            <div className="p-4 space-y-3">
              <h3 className="font-bold text-slate-900 mb-4">Lost & Found</h3>
              {items.map((item) => {
                const timeAgo = formatDistanceToNow(new Date(item.created_at), { addSuffix: true });
                return (
                  <Link key={item.id} href={`/posts/${item.id}`}>
                    <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer border border-slate-100">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.category === 'lost' ? '🔴' : '🟢'} {item.category === 'lost' ? 'Lost' : 'Found'} • Room {item.room}</p>
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{timeAgo}</span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              <p>No lost or found items</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
