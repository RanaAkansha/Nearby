'use client';

import { Button } from '@/components/ui/button';

type Category = 'all' | 'sell' | 'free' | 'lost' | 'found' | 'announcement';

interface CategoryFilterProps {
  selected: Category;
  onSelect: (category: Category) => void;
}

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'sell', label: 'For Sale' },
  { value: 'free', label: 'Free' },
  { value: 'lost', label: 'Lost' },
  { value: 'found', label: 'Found' },
  { value: 'announcement', label: 'Announcements' },
];

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <Button
          key={cat.value}
          variant={selected === cat.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(cat.value)}
          className={`whitespace-nowrap transition-all duration-200 ${
            selected === cat.value
              ? 'bg-purple-600 text-white shadow-md hover:shadow-lg hover:bg-purple-700'
              : 'border-slate-200 hover:border-purple-300 hover:text-purple-600'
          }`}
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );
}
