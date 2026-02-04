import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
          <span className="font-bold text-lg text-slate-900">Hostel Board</span>
        </Link>
        <Link href="/new">
          <Button size="sm">+ Post</Button>
        </Link>
      </div>
    </header>
  );
}
