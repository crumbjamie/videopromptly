import { NextResponse } from 'next/server';
import { searchPrompts } from '@/lib/database';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const results = await searchPrompts(query);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { error: 'Failed to search prompts' },
      { status: 500 }
    );
  }
}