import { AddPostForm } from '@/components/add-post-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'Create Post - Nearby',
  description: 'Create a new post to share what\'s around you',
};

export default function NewPostPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-6 sm:mb-8 hover:bg-slate-100 transition-colors text-sm sm:text-base">
            ← Back to Nearby
          </Button>
        </Link>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Share Something</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">Post what's around you</p>
        </div>
        <AddPostForm />
      </div>
    </main>
  );
}
