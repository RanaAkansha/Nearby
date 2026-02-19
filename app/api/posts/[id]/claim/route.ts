import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { claimedBy } = body;

    if (!claimedBy) {
      return NextResponse.json(
        { error: 'claimedBy name is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('posts')
      .update({
        claimed: true,
        claimed_by: claimedBy,
        claimed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data[0], { status: 200 });
  } catch (error) {
    console.error('Error claiming post:', error);
    return NextResponse.json({ error: 'Failed to claim post' }, { status: 500 });
  }
}
