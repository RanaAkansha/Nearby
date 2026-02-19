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
    let { postId } = body;
    
    // Get userId from localStorage (passed by client) or use a default
    const userId = body.userId || 'guest';

    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 }
      );
    }

    if (!favorites.has(userId)) {
      favorites.set(userId, new Set());
    }

    const userFavorites = favorites.get(userId)!;
    userFavorites.add(postId);

    return NextResponse.json(
      { success: true, favorites: Array.from(userFavorites) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating favorites:', error);
    return NextResponse.json({ error: 'Failed to update favorites' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId } = body;
    const userId = body.userId || 'guest';

    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 }
      );
    }

    if (favorites.has(userId)) {
      const userFavorites = favorites.get(userId)!;
      userFavorites.delete(postId);
    }

    return NextResponse.json(
      { success: true, favorites: Array.from(favorites.get(userId) || new Set()) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}
