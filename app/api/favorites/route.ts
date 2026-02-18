import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for favorites (in production, use a database)
// localStorage equivalent for API
const favorites = new Map<string, Set<string>>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ favorites: [] }, { status: 200 });
    }

    const userFavorites = favorites.get(userId) || new Set();
    return NextResponse.json({ favorites: Array.from(userFavorites) }, { status: 200 });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, postId, action } = body;

    if (!userId || !postId) {
      return NextResponse.json(
        { error: 'userId and postId are required' },
        { status: 400 }
      );
    }

    if (!favorites.has(userId)) {
      favorites.set(userId, new Set());
    }

    const userFavorites = favorites.get(userId)!;

    if (action === 'add') {
      userFavorites.add(postId);
    } else if (action === 'remove') {
      userFavorites.delete(postId);
    }

    return NextResponse.json(
      { favorites: Array.from(userFavorites) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating favorites:', error);
    return NextResponse.json({ error: 'Failed to update favorites' }, { status: 500 });
  }
}
