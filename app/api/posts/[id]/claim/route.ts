import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .update({
        claimed: true,
        claimed_by: 'User',
        claimed_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 200 });
  } catch (error) {
    console.error('Error claiming post:', error);
    return NextResponse.json({ error: 'Failed to claim post' }, { status: 500 });
  }
}
